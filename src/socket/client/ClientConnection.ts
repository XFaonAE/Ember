import {connection as WebSocketConnection} from "websocket";

export default class ClientConnection {
    private events: any = {message: [], reply: []}

    public webSocketConnection: WebSocketConnection

    public constructor(webSocketConnection: WebSocketConnection) {
        this.webSocketConnection = webSocketConnection

        this.webSocketConnection.on("message", (rawMessage: any) => {
            try {
                const message = JSON.parse(rawMessage.utf8Data)
                if (message.reply) {
                    this.events.reply.forEach((event: any) => {
                        if (event.channel == message.channel) {
                            event.callback(message.message)
                        }
                    })
                } else {
                    this.events.message.forEach((event: any) => {
                        if (event.channel == message.channel) {
                            event.callback(message.message)
                        }
                    })
                }
            } catch (e: any){
                // TODO: Te he ofc this one too
            }
        })
    }

    public send(message: {[index: string]: any}, channel: string) {
        if (!this.webSocketConnection.connected) {
            throw new Error("This connection is not connected to the host anymore")
        }

        this.webSocketConnection.sendUTF(JSON.stringify({
            channel: channel,
            message: message
        }))
    }

    public on(event: "message", callback: (message: {[index: string]: any}) => any, channel: string): void
    public on(event: "reply", callback: (message: {[index: string]: any}) => any, channel: string): void

    public on(event: any, callback: any, channel?: string) {
        if (event == "message") {
            this.events.message.push({
                channel: channel,
                callback: callback
            })
            return
        } else if (event == "reply") {
            this.events.reply.push({
                channel: channel,
                callback: callback
            })
            return
        }

        this.events[event].push(callback)
    }
}