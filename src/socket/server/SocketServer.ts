import ServerConnection from "./ServerConnection";
import ConnectionManager from "./ConnectionManager";
import * as https from "https";
import http, { IncomingMessage, ServerResponse } from "http";
import { server as WebSocketServer, request as WebSocketRequest, connection } from "websocket";
import ClientConnection from "../client/ClientConnection";
import { socket } from "../../Main";
import { SocketMessage } from "../Socket";

export interface ServerOptions {
    port?: number
    host?: string
    accessInfo?: {
        user: string
        password: string
    }
    ssl?: {
        key: string
        certificate: string
    }
    cluster?: Array<{
        port: number
        host: string
        user?: string
        password?: string
    }>
}

const defaultServerOptions: ServerOptions = {
    port: 8080,
    host: "localhost"
}
export { defaultServerOptions }

export default class SocketServer {
    public config: ServerOptions
    public connectionManager: ConnectionManager = new ConnectionManager()

    private events: any = {error: [], open: [], ready: []}
    private httpServer: https.Server|http.Server|null = null
    private webSocketServer: WebSocketServer|null = null

    public constructor(options: ServerOptions) {
        this.config = {...defaultServerOptions, ...options}

        this.attachHttp()
        this.createSocket()
    }

    private createSocket() {
        if (this.httpServer) {
            this.webSocketServer = new WebSocketServer({
                autoAcceptConnections: false,
                httpServer: this.httpServer
            })

            this.webSocketServer.on("request", (request: WebSocketRequest) => {
                const connection = new ServerConnection(request)

                this.events.open.forEach((event: any) => {
                    event(connection)
                })
            })

            this.on("ready", () => {
                this.rootControlCheck()
                this.connectNodes()
            })

            this.on("open", (connection: ServerConnection) => {
                connection.server = this

                connection.on("accept", () => {
                    const clientId = "id" + Math.random()
                    this.connectionManager.appendClient(clientId, connection)

                    connection.on("close", () => {
                        this.connectionManager.removeClient(clientId)
                    })
                })
            })
        }
    }

    private connectNodes() {
        this.config.cluster?.forEach((node: any) => {
            const client = socket.createClient({
                port: node.port,
                host: node.host,
                root: {
                    user: node.user,
                    password: node.password
                }
            })

            client.on("open", (connection: ClientConnection) => {
                connection.on("reply", (reply: any) => {
                    if (reply.root) {
                        let nodeId = this.config.host ? this.config.host : defaultServerOptions.host
                        if (this.config.port) {
                            nodeId += ":" + this.config.port
                        }

                        this.connectionManager.appendNode(<string>nodeId, connection)
                    }
                }, "root")
            })

            client.connect()
        })
    }

    private attachHttp() {
        const httpRequest = (request: IncomingMessage, response: ServerResponse) => {
            response.writeHead(200)
            response.write(`
                <!doctype html>
                <html lang="en">
                <head>
                    <title>:( Error</title>    
                    <style>
                        * {
                            font-family: sans-serif;
                            font-weight: lighter;
                            background: rgb(32, 32, 32);
                            color: #fff;
                        }
                    </style>    
                </head>
                <body>
                    <h1 style="color: #ff5555;">:( Error</h1>
                    <p>This HTTP server was meant for the WebSocket server, not you!</p>
                </body>
                </html>
            `)

            response.end()
        }

        if (this.config.ssl) {
            this.httpServer = https.createServer(httpRequest)
        } else {
            this.httpServer = http.createServer(httpRequest)
        }
    }

    public rootControlCheck() {
        const verify = (connection: ServerConnection, valid: () => any) => {
            if (!connection.props.root) {
                connection.close()
                return
            }

            valid()
        }

        this.on("open", (connection: ServerConnection) => {
            connection.on("message", (message: any, reply: CallableFunction) => {
                if (message.user == this.config.accessInfo?.user && message.password == this.config.accessInfo?.password) {
                    connection.props.root = true
                    reply({
                        root: true
                    })
                } else {
                    reply({
                        root: false
                    })
                    connection.close()
                }
            }, "root")

            connection.on("message", (message: SocketMessage) => {
                verify(connection, () => {
                    const child = this.connectionManager.getClient(message.clientId)

                    console.log(typeof child)
                    child?.send(message.clientMessage, message.channel)
                })
            }, "root:send")
        })
    }

    public run() {
        this.httpServer?.listen(this.config.port, this.config.host)
        this.events.ready.forEach((event: any) => {
            event()
        })
    }

    public on(event: "error", callback: (error: string) => any): void
    public on(event: "open", callback: (connection: ServerConnection) => any): void
    public on(event: "ready", callback: () => any): void

    public on(event: any, callback: any) {
        this.events[event].push(callback)
    }
}