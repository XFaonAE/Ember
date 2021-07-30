import {request as WebSocketRequest,connection as WebSocketConnection } from "websocket"

export default class ServerConnection {
    private connectionStatus: "accepted"|"requesting" = "requesting"
    private webSocketConnectionRequest: WebSocketRequest
    private events: any = {message: [], close: [], accept: [], reject: []}

    public webSocketConnection: WebSocketConnection|null = null

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
            return
        }

        throw new Error("This connection has already been accepted")
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

    public on(event: any, callback: any) {
        this.events[event].push(callback)
    }
}