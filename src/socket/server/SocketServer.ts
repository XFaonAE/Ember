import * as https from "https";
import * as http from "http";
import { server, request as WebSocketRequest } from "websocket";
import ServerConnection from "./ServerConnection";
import NodeHelper from "../NodeHelper";

export interface ServerNode {
    port: number;
    host?: string;
    auth?: {
        user: string;
        password: string;
    };
}

export interface ServerOptions {
    port: number;
    host?: string;
    nodes: ServerNode[];
    auth?: {
        user: string;
        password: string;
    };
    ssl?: {
        key: string;
        certificate: string;
    };
}

export default class SocketServer {
    public config: ServerOptions;
    public httpServer: http.Server | https.Server | null = null;
    public socket: server | null = null;
    public connections: ServerConnection[] = [];
    public events: { [index: string]: any[] } = { open: [], error: [], run: [] };
    public nodeHelper = new NodeHelper();

    public constructor(options: ServerOptions) {
        const defaultOptions: ServerOptions = {
            port: 1000,
            host: "localhost",
            nodes: [],
            auth: {
                user: "",
                password: ""
            }
        };

        this.config = { ...defaultOptions, ...options };

        this.createHttpServer();
        this.createSocket();
    }

    private createHttpServer() {
        if (this.config.ssl) {
            this.httpServer = https.createServer();
            return;
        }

        this.httpServer = http.createServer();
    }

    private createSocket() {
        if (this.httpServer) {
            this.socket = new server({
                httpServer: this.httpServer,
                autoAcceptConnections: false
            });

            this.handleSocket();
        }
    }

    private handleSocket() {
        const socket = this.socket!;

        this.on("run", () => {
            this.nodeHelper.connect(this.config.nodes);
        });

        socket.on("request", (request: WebSocketRequest) => {
            const connection = new ServerConnection(request);
            this.events.open.forEach((event: any) => {
                event(connection);
            });
        });
    }

    public run() {
        this.httpServer?.listen(this.config.port, this.config.host);
        this.events.run.forEach((event: any) => {
            event();
        });
    }

    public on(event: "open", callback: (connection: ServerConnection) => any): void;
    public on(event: "error", callback: (error: string) => any): void;
    public on(event: "run", callback: () => any): void;

    public on(event: any, callback: any) {
        this.events[event]?.push(callback);
    }
}