import SocketServer, {ServerOptions} from "./server/SocketServer"
import SocketClient, {ClientOptions} from "./client/SocketClient"

export default class Socket {
	public createServer(options: ServerOptions): SocketServer {
		return new SocketServer(options)
	}

	public createClient(options: ClientOptions): SocketClient {
		return new SocketClient(options)
	}
}