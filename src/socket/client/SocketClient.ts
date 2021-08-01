import { client, connection } from "websocket";
import ClientConnection from "./ClientConnection";

export interface ClientOptions {
    port: number;
    host?: string;
    ssl?: boolean;
}

export default class SocketClient {
    public config: ClientOptions;
    public socket: client | null = null;
    public events: { [index: string]: any } = { open: [], error: [] };

    public constructor(options: ClientOptions) {
        const defaultOptions: ClientOptions = {
            port: 1000,
            host: "localhost",
            ssl: false
        };

        this.config = { ...defaultOptions, ...options };
        this.createSocket();
    }

    private createSocket() {
        this.socket = new client();

        this.socket.on("connect", (connection: connection) => {
            const clientConnection = new ClientConnection(connection);

            this.events.open.forEach((event: any) => {
                event(clientConnection);
            });
        })
    }

    public run() {
        this.socket?.connect((this.config.ssl ? "wss://" : "ws://") + this.config.host + (this.config.port ? ":" + this.config.port : ""));
    }

    public on(event: "open", callback: (connection: ClientConnection) => any): void;

    public on(event: any, callback: any) {
        this.events[event].push(callback);
    }

    public send(message: any, channel: string) {

    }
}