import * as https from "https"
import * as http from "http"
import { server, request as WebSocketRequest } from "websocket"
import ServerConnection from "./ServerConnection"
import NodeHelper from "../NodeHelper"
import { utils } from "../../Main"

export interface ServerNode {
	port: number | null
	host?: string
	logStats?: boolean
	auth?: {
		user?: string
		password?: string
	}
}

export interface ServerOptions {
	port: number
	host: string
	nodes: ServerNode[]
	auth?: {
		user: string
		password: string
	}
	ssl?: {
		key: string
		certificate: string
	}
}

export default class SocketServer {
	public config: ServerOptions
	public httpServer: http.Server | https.Server | null = null
	public socket: server | null = null
	public connections: ServerConnection[] = []
	public events: { [index: string]: any[] } = { open: [], error: [], run: [], ready: [] }
	public nodeHelper = new NodeHelper()
	public nodeToken: string

	public constructor(options: ServerOptions) {
		this.nodeToken = this.randomToken(128)

		const defaultOptions: ServerOptions = {
			port: 1000,
			host: "localhost",
			nodes: [],
			auth: {
				user: "",
				password: ""
			}
		}
		this.config = utils.parseConfig(defaultOptions, options)

		this.config.nodes.forEach((nodeConfig: ServerNode) => {
			if (!nodeConfig.auth) {
				nodeConfig.auth = { user: "", password: "" }
			}

			if (typeof nodeConfig.logStats == "undefined") {
				nodeConfig.logStats = false
			}
		})

		this.createHttpServer()
		this.createSocket()
	}

	public randomToken(size: number): string {
		let result = ""
		const characters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890"
		const charactersLength = characters.length

		for (let i = 0 i < size i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}

		return result
	}

	private createHttpServer() {
		if (this.config.ssl) {
			this.httpServer = https.createServer()
			return
		}

		this.httpServer = http.createServer()
	}

	private createSocket() {
		if (this.httpServer) {
			this.socket = new server({
				httpServer: this.httpServer,
				autoAcceptConnections: false
			})

			this.handleSocket()
		}
	}

	public getClient(id: string) {
		let returnValue: ServerConnection|undefined

		this.connections.forEach((conn: ServerConnection) => {
			if (conn.id == id) {
				returnValue = conn
			}
		})

		return returnValue
	}

	private listenRoot(connection: ServerConnection) {
		const verify = (message: any, callback: () => any) => {
			if (message.token == this.nodeToken) {
				callback()
				return
			}

			// TODO: Connection.close()
		}

		connection.on("message", (message: any) => {
			if (message.user == this.config.auth?.user && message.password == this.config.auth?.password) {
				connection.send({
					token: this.nodeToken
				}, "nodeAccess")
			} else {
				connection.close({
					error: 1000
				})
			}
		}, "nodeAccess")

		// Message send events
		connection.on("message", (message: any) => {
			verify(message, () => {
				const endPoint = this.getClient(message.client)
				endPoint?.send(message.message, message.channel)
			})
		}, "nodeSendClient")
	}

	private handleSocket() {
		const socket = this.socket!
		let autoAccept = false

		this.on("run", () => {
			autoAccept = true
			this.on("open", (conn: ServerConnection) => {
				conn.on("accept", () => {
					conn.id = this.randomToken(5)
					this.connections.push(conn)
				})
			})
			
			this.nodeHelper.connect(this.config.nodes, this.config, () => {
				this.events.ready.forEach((event: any) => event())
			})
		})

		socket.on("request", (request: WebSocketRequest) => {
			const connection = new ServerConnection(request)
			this.listenRoot(connection)

			this.events.open.forEach((event: any) => {
				event(connection)
			})
		})
	}

	public run() {
		this.httpServer?.listen(this.config.port, this.config.host)
		this.events.run.forEach((event: any) => {
			event()
		})
	}

	public on(event: "open", callback: (connection: ServerConnection) => any): void
	public on(event: "error", callback: (error: string) => any): void
	public on(event: "run", callback: () => any): void
	public on(event: "ready", callback: () => any): void

	public on(event: any, callback: any) {
		this.events[event]?.push(callback)
	}
}
