export interface ServerOptions {
    port: number;
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
export default class Server {
    constructor(options: ServerOptions);
}
//# sourceMappingURL=Server.d.ts.map