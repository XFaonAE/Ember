"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminal = exports.socket = void 0;
const Socket_1 = __importDefault(require("./socket/Socket"));
const Terminal_1 = __importDefault(require("./terminal/Terminal"));
const socket = new Socket_1.default();
exports.socket = socket;
const terminal = new Terminal_1.default();
exports.terminal = terminal;
//# sourceMappingURL=Main.js.map