import Server, {ServerOptions} from "./server/Server";
import Client, {ClientOptions} from "./client/Client";

export default class Socket {
    /**
     * Create a new websocket server
     * @param {ServerOptions} options
     * @return {Server}
     */
    public createServer(options: ServerOptions) {
        return new Server(options)
    }

    /**
     * Create a new websocket client connection
     * @param {ClientOptions} options
     * @return {Client}
     */
    public createClient(options: ClientOptions) {
        return new Client(options)
    }
}