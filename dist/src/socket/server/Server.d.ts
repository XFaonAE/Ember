import ServerConnection from "./ServerConnection";
export interface ServerOptions {
    port?: number;
    host?: string;
    accessInfo?: {
        user: string;
        password: string;
    };
    ssl?: {
        key: string;
        certificate: string;
    };
    cluster?: Array<{
        port: number;
        host: string;
        user?: string;
        password?: string;
    }>;
}
declare const defaultServerOptions: ServerOptions;
export { defaultServerOptions };
export default class Server {
    config: ServerOptions;
    private events;
    private httpServer;
    private webSocketServer;
    constructor(options: ServerOptions);
    private createSocket;
    private attachHttp;
    run(): void;
    on(event: "error", callback: (error: string) => any): void;
    on(event: "open", callback: (connection: ServerConnection) => any): void;
    on(event: "ready", callback: () => any): void;
}
//# sourceMappingURL=Server.d.ts.map