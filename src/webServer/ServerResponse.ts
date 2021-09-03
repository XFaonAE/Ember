import { IncomingMessage as HttpIncomingMessage, ServerResponse as HttpServerResponse } from "http"

export default class ServerResponse {
    public http: { [ index: string ]: any } = { request: null, response: null }

    public constructor(request: HttpIncomingMessage, response: HttpServerResponse) {
        this.http.request = request
        this.http.response = response
    }
}