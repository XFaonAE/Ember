import {connection as WebSocketConnection} from "websocket";

export default class ClientConnection {
    private events: any = {message: []}

    public webSocketConnection: WebSocketConnection

    public constructor(webSocketConnection: WebSocketConnection) {
        this.webSocketConnection = webSocketConnection
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
}