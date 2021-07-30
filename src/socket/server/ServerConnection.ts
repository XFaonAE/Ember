import {request as WebSocketRequest,connection as WebSocketConnection } from "websocket"

export default class ServerConnection {
    private connectionStatus: "accepted"|"requesting" = "requesting"
    private webSocketConnectionRequest: WebSocketRequest

    public webSocketConnection: WebSocketConnection|null = null

    public constructor(webSocketConnectionRequest: WebSocketRequest) {
        this.webSocketConnectionRequest = webSocketConnectionRequest
    }

    public accept() {
        if (this.connectionStatus == "requesting") {
            this.webSocketConnection = this.webSocketConnectionRequest.accept()
            this.connectionStatus = "accepted"
        } else {
            throw new Error("This connection has already been accepted")
        }
    }

    public reject() {
        if (this.connectionStatus == "requesting") {
            this.webSocketConnectionRequest.reject()
        } else if (this.connectionStatus == "accepted") {
            throw new Error("This connection has already been accepted")
        }
    }
}