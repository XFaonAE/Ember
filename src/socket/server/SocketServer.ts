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