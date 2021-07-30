export interface ClientOptions {
    port: number
    host?: string
    ssl?: boolean
    root?: {
        user: string
        password: string
    }
}

export default class Client {
    public constructor(options: ClientOptions) {
    }
}