import SocketClient, { ClientOptions } from "./client/SocketClient";
import SocketServer, { ServerOptions } from "./server/SocketServer";

export interface SocketMessage {
    [index: string]: any;
}

export default class Socket {
    public createServer(options: ServerOptions) {
        return new SocketServer(options)
    }

    public createClient(options: ClientOptions) {
        return new SocketClient(options)
    }
}