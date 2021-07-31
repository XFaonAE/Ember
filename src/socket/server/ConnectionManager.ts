import ServerConnection from "./ServerConnection";

export default class ConnectionManager {
    public clients: {[index: string]: ServerConnection} = {}
    public clientSize: number = 0
    // public nodes: Array<ClientConnection>
    // public nodeSize: number = 0

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
}