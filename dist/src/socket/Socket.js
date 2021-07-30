"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./server/Server"));
const Client_1 = __importDefault(require("./client/Client"));
class Socket {
    createServer(options) {
        return new Server_1.default(options);
    }
    createClient(options) {
        return new Client_1.default(options);
    }
}
exports.default = Socket;
//# sourceMappingURL=Socket.js.map