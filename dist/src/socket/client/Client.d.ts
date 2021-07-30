export interface ClientOptions {
    port: number;
    host?: string;
    ssl?: boolean;
    root?: {
        user: string;
        password: string;
    };
}
export default class Client {
    constructor(options: ClientOptions);
}
//# sourceMappingURL=Client.d.ts.map