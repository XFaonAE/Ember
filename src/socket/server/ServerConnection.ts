import {request as WebSocketRequest, connection as WebSocketConnection, connection} from "websocket"

export default class ServerConnection {
    private connectionStatus: "accepted"|"requesting" = "requesting"
    private webSocketConnectionRequest: WebSocketRequest
    private events: any = {message: [], close: [], accept: [], reject: []}

    public webSocketConnection: WebSocketConnection|null = null
    public id: string = ""
    public props: {[index: string]: any} = {}

    public constructor(webSocketConnectionRequest: WebSocketRequest) {
        this.webSocketConnectionRequest = webSocketConnectionRequest
    }

    public accept() {
        if (this.connectionStatus == "requesting") {
            this.webSocketConnection = this.webSocketConnectionRequest.accept()
            this.connectionStatus = "accepted"
            this.events.accept.forEach((event: any) => {
                event()
            })

            this.webSocketConnection.on("message", (message: any) => {
                try {
                    const msg = JSON.parse(message.utf8Data)

                    this.events.message.forEach((event: any) => {
                        if (msg.channel == event.channel) {
                            event.callback(msg.message, (reply: {[index: string]: any}) => {
                                this.send(reply, event.channel, true)
                            })
                        }
                    })
                } catch (e: any) {
                    // TODO: Add new event called "messageIgnoreChecks" for any data type messages
                }
            })

            return
        }

        throw new Error("This connection has already been accepted")
    }

    public send(message: {[index: string]: any}, channel: string, reply: boolean = false) {
        try {
            this.webSocketConnection?.sendUTF(JSON.stringify({
                channel: channel,
                reply: reply,
                message: message
            }))
        } catch (e: any) {
            // TODO: Handle? :3 Please
        }
    }

    public reject() {
        if (this.connectionStatus == "requesting") {
            this.webSocketConnectionRequest.reject()
            this.close()
            this.events.reject.forEach((event: any) => {
                event()
            })
        } else if (this.connectionStatus == "accepted") {
            throw new Error("This connection has already been accepted")
        }
    }

    public close() {
        this.webSocketConnection?.close()
        this.events.close.forEach((event: any) => {
            event()
        })
        return
    }

    public on(event: "close", callback: () => any): void
    public on(event: "reject", callback: () => any): void
    public on(event: "accept", callback: () => any): void
    public on(event: "message", callback: (message: {[index: string]: any}, reply: (message: {[index: string]: any}) => any) => any, channel: string,): void

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
}