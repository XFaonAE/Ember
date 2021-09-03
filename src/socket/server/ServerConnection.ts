
import { connection, request } from "websocket"

export default class ServerConnection {
	public request: request|null
	public connection: connection|null = null
	public events: { [index: string]: any[] } = { message: [], accept: [] }
	public props: { [index: string]: any } = {}
	public id: string|null = null
	public accepted = false

	public constructor(request: request) {
		this.request = request
	}

	private handleSocket() {
		const socket = this.connection!

		socket.on("message", (stringMessage: any) => {
			try {
				const message = JSON.parse(stringMessage.utf8Data)
				this.events.message.forEach((event: any) => {
					if (event.channel == message.channel) {
						event.callback(message.data)
					}
				})
			} catch (error: any) {
				console.log(error.toString())
			}
		})
	}

	public accept() {
		if (!this.accepted) {
			this.accepted = true
			this.connection = this.request ? this.request.accept() : null

			this.events.accept.forEach((event: any) => event())

			this.request = null
			this.handleSocket()
		}
	}

	public reject() {
		this.request?.reject()
	}

	public on(event: "message", callback: (message: any) => any, channel: string): void
	public on(event: "accept", callback: () => any): void

	public on(event: any, callback: any, channel?: string) {
		if (event == "message") {
			this.events[event].push({
				channel: channel,
				callback: callback
			})
			return
		}

		this.events[event].push(callback)
	}

	public send(message: { [index: string]: any }, channel: string) {
		this.connection?.send(JSON.stringify({
			channel: channel,
			data: message
		}))
	}

	public close(reason: { [index: string]: any }) {
		if (reason) {
			this.send(reason, "close")
		}

		this.connection?.close()
	}
}