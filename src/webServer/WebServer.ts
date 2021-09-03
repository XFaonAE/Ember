import http, { IncomingMessage as HttpIncomingMessage, ServerResponse as HttpServerResponse } from "http"
import https from "https"
import { utils } from "../Main"
import ServerResponse from "./ServerResponse"

export interface WebServerOptions {
    port: number
    host: string
    ssl?: {
        key: string
        certificate: string
    }
    notFound?: {
        get?: boolean
        post?: boolean
    }
}

export default class WebServer {
    public config?: WebServerOptions
    public server?: http.Server | https.Server
    public events: { [ index: string ]: any } = { get: [], post: [], get404: [], post404: [] }
    public meta: { [ index: string ]: any } = { get: [], post: [] }

    public constructor(options?: WebServerOptions) {
        if (options) {
            this.config = utils.parseConfig({
                port: 8080,
                host: "localhost",
                ssl: {
                    key: "",
                    certificate: ""
                },
                notFound: {
                    get: true,
                    post: true
                }
            } as WebServerOptions, options)

            this.createServer()
        }
    }

    public create(options: WebServerOptions) {
        return new WebServer(options)
    }

    private createServer() {
        const request = (request: HttpIncomingMessage, response: HttpServerResponse) => {
            const serverResponse = new ServerResponse(request, response)
            let matched = false

            if (request.method == "GET") {
                this.events.get.forEach((event: any, index: number, eventKey: any) => {
                    if (event.path == request.url) {
                        matched = true
                        event.callback(() => response.end())
                    }

                    if (this.config?.notFound?.get) {
                        if (index == eventKey.length - 1 && !matched) {
                            this.events.get404.forEach((event: any) => {
                                console.log(`[ 404 ] At path: ${request.url}`)
                                event.callback(() => response.end())
                            })
                        }
                    }
                })
            }
        }

        if (this.config?.ssl && this.config.ssl.key && this.config.ssl.certificate) {
            this.server = https.createServer(request)
            return
        }

        this.server = http.createServer(request)
    }

    public run() {
        this.server?.listen(this.config?.port, this.config?.host)
    }

    public on(event: "get", callback: (end: () => any) => any, path: string): void
    public on(event: "get404", callback: (end: () => any) => any): void

    public on(event: any, callback: any, path?: string) {
        if (path) {
            this.meta[event].forEach((meta: string, index: number) => {
                if (meta == path) {
                    delete this.meta[event][index]
                }
            })

            this.meta[event].push(path ? path : "")
        }

        this.events[event].push({
            path: path,
            callback: callback
        })
    }
}