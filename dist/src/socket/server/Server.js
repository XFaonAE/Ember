"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultServerOptions = void 0;
const ServerConnection_1 = __importDefault(require("./ServerConnection"));
const https = __importStar(require("https"));
const http_1 = __importDefault(require("http"));
const websocket_1 = require("websocket");
const defaultServerOptions = {
    port: 8080,
    host: "localhost"
};
exports.defaultServerOptions = defaultServerOptions;
class Server {
    config;
    events = { error: [], open: [], ready: [] };
    httpServer = null;
    webSocketServer = null;
    constructor(options) {
        this.config = {
            ...defaultServerOptions,
            ...options
        };
        this.attachHttp();
        this.createSocket();
    }
    createSocket() {
        if (this.httpServer) {
            this.webSocketServer = new websocket_1.server({
                autoAcceptConnections: false,
                httpServer: this.httpServer
            });
            this.webSocketServer.on("request", (request) => {
                const connection = new ServerConnection_1.default(request);
                this.events.open.forEach((event) => {
                    event(connection);
                });
            });
        }
    }
    attachHttp() {
        const httpRequest = (request, response) => {
            response.writeHead(200);
            response.write(`
                <!doctype html>
                <html lang="en">
                <head>
                    <title>:( Error</title>    
                    <style>
                        * {
                            font-family: sans-serif;
                            font-weight: lighter;
                            background: rgb(32, 32, 32);
                            color: #fff;
                        }
                    </style>    
                </head>
                <body>
                    <h1 style="color: #ff5555;">:( Error</h1>
                    <p>This HTTP server was meant for the WebSocket server, not you!</p>
                </body>
                </html>
            `);
            response.end();
        };
        if (this.config.ssl) {
            this.httpServer = https.createServer(httpRequest);
        }
        else {
            this.httpServer = http_1.default.createServer(httpRequest);
        }
    }
    run() {
        this.httpServer?.listen(this.config.port, this.config.host);
        this.events.ready.forEach((event) => {
            event();
        });
    }
    on(event, callback) {
        this.events[event].push(callback);
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map