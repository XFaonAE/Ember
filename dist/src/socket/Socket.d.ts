import Server, { ServerOptions } from "./server/Server";
import Client, { ClientOptions } from "./client/Client";
export default class Socket {
    /**
     * Create a new websocket server
     * @param {ServerOptions} options
     * @return {Server}
     */
    createServer(options: ServerOptions): Server;
    /**
     * Create a new websocket client connection
     * @param {ClientOptions} options
     * @return {Client}
     */
    createClient(options: ClientOptions): Client;
}
//# sourceMappingURL=Socket.d.ts.map