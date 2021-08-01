import { client as WebSocketClient, connection, connection as WebSocketConnection } from "websocket";
import ClientConnection from "./ClientConnection";
import { SocketMessage } from "../Socket";

export interface ClientOptions {
    port?: number
    host?: string
    ssl?: boolean
    root?: {
        user: string
        password: string
    }
}

const defaultClientOptions = {
    port: 8080,
    host: "localhost",
    ssl: false,
    root: {
        user: "",
        password: ""
    }
}
export {defaultClientOptions}

export default class SocketClient {
    private events: any = {error: [], open: []}

    public webSocketConnection: WebSocketClient
    public config: ClientOptions

    public constructor(options: ClientOptions) {
        this.config = {...defaultClientOptions, ...options}
        this.webSocketConnection = new WebSocketClient()
    }

    public connect() {
        const protocol = this.config.ssl ? "wss://" : "ws://"
        const port = this.config.port ? ":" + this.config.port : ""

        this.webSocketConnection.connect(protocol + this.config.host + port)

        this.webSocketConnection.on("connect", (connection: WebSocketConnection) => {
            const connPublic = new ClientConnection(connection)
            this.events.open.forEach((event: any) => event(connPublic))
        })

        this.webSocketConnection.on("connectFailed", () => {
            this.events.error.forEach((event: any) => {
                event()
            })
        })

        this.on("open", (connection: ClientConnection) => {
            connection.client = this

            if (this.config.root) {
                connection.send({
                    user: this.config.root.user,
                    password: this.config.root.password
                }, "root")
            }
        })
    }

    public on(event: "error", callback: (error: string) => any): void
    public on(event: "open", callback: (connection: ClientConnection) => any): void

    public on(event: any, callback: any) {
        this.events[event].push(callback)
    }
}