import Server, { ServerOptions } from "./server/Server";
import Client, { ClientOptions } from "./client/Client";
export default class Socket {
    createServer(options: ServerOptions): Server;
    createClient(options: ClientOptions): Client;
}
//# sourceMappingURL=Socket.d.ts.map