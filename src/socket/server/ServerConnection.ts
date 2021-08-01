import { connection, request } from "websocket";

export default class ServerConnection {
    public request: request|null;
    public connection: connection|null = null;

    public constructor(request: request) {
        this.request = request;
    }

    public accept() {
        this.connection = this.request ? this.request.accept() : null;
        this.request = null;
    }

    public reject() {
        this.request?.reject();
    }
}