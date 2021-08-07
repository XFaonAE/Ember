import http, { IncomingMessage, ServerResponse } from "http";
import https from "https";
import { utils } from "../Main";

export interface WebServerOptions {
    port: number;
    host: string;
    ssl?: {
        key: string;
        certificate: string;
    };
}

export default class WebServer {
    public config?: WebServerOptions;
    public server?: http.Server | https.Server;
    public events: { [ index: string ]: any } = { get: [], post: [] };

    public constructor(options?: WebServerOptions) {
        if (options) {
            this.config = utils.parseConfig({
                port: 8080,
                host: "localhost",
                ssl: {
                    key: "",
                    certificate: ""
                }
            } as WebServerOptions, options);

            this.createServer();
        }
    }

    public create(options: WebServerOptions) {
        return new WebServer(options);
    }

    private createServer() {
        const request = (request: IncomingMessage, response: ServerResponse) => {
            response.write("Hi");
            if (request.method == "GET") {
                this.events.get.forEach((event: any) => {
                    if (event.path == request.url) {
                        event.callback(() => response.end());
                    }
                });
            }
        }

        if (this.config?.ssl && this.config.ssl.key && this.config.ssl.certificate) {
            this.server = https.createServer(request);
            return;
        }

        this.server = http.createServer(request);
    }

    public run() {
        this.server?.listen(this.config?.port, this.config?.host);
    }

    public on(event: "get", path: string, callback: (end: () => any) => any): void;

    public on(event: any, path: string, callback: any) {
        this.events[event].push({
            path: path,
            callback: callback
        });
    }
}