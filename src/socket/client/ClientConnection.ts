import { connection } from "websocket"

export default class ClientConnection {
    public socket: connection
    public events: { [index: string]: any } = { message: [] }
    public props: { [index: string]: any } = {}

    public constructor(connection: connection) {
        this.socket = connection
        this.handleConn()
    }

    private handleConn() {
        const socket = this.socket!

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

    public on(event: "message", callback: (message: any) => any, channel: string): void

    public on(event: any, callback: any, channel?: string) {
        if (event == "message") {
            this.events.message.push({
                channel: channel,
                callback: callback
            })
            return
        }

        this.events[event].push(callback)
    }

    public send(message: { [index: string]: any }, channel: string) {
        this.socket.send(JSON.stringify({
            channel: channel,
            data: message
        }))
    }
}