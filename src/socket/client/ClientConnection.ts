import { connection } from "websocket";

export default class ClientConnection {
    public socket: connection;
    public events: { [index: string]: any } = { open: [], error: [] };

    public constructor(connection: connection) {
        this.socket = connection;
    }

    public on(event: "message", callback: (message: any) => any): void

    public on(event: any, callback: any) {
        this.events[event].push(callback);
    }
}