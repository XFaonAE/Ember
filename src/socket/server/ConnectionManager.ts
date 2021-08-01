import ServerConnection from "./ServerConnection";
import ClientConnection from "../client/ClientConnection";
import { SocketMessage } from "../Socket";

export default class ConnectionManager {
    public clients: {[index: string]: ServerConnection} = {}
    public clientSize: number = 0
    public nodes: {[index: string]: ClientConnection} = {}
    public nodeSize: number = 0

    public getClient(clientId: string): ServerConnection|undefined {
        if (this.clients[clientId]) {
            return this.clients[clientId]
        }
    }

    public appendClient(clientId: string, connection: ServerConnection) {
        connection.id = clientId
        this.clientSize++

        this.clients[clientId] = connection
    }

    public removeClient(clientId: string, disconnect: boolean = false) {
        if (disconnect) {
            this.getClient(clientId)?.close()
        }

        this.clientSize--
        delete this.clients[clientId]
    }

    public appendNode(nodeId: string, node: ClientConnection) {
        this.nodeSize++

        this.nodes[nodeId] = node
        this.helperRoot(nodeId)
    }

    public getNode(nodeId: string): ClientConnection|undefined {
        return this.nodes[nodeId]
    }

    public helperRoot(nodeId: string) {
        const node = this.getNode(nodeId)
    }

    public sendNetwork(nodeId: string, clientId: string, message: SocketMessage, channel: string) {
        const node = this.getNode(nodeId)

        console.log(nodeId, typeof node)

        node?.send({
            clientId: clientId,
            clientMessage: message,
            channel: channel
        }, "root:send")
    }
}