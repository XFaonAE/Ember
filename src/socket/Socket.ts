import Server, {ServerOptions} from "./server/Server";
import Client, {ClientOptions} from "./client/Client";

export default class Socket {
    public createServer(options: ServerOptions) {
        return new Server(options)
    }

    public createClient(options: ClientOptions) {
        return new Client(options)
    }
}