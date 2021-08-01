import Socket from "./socket/Socket";
import Terminal from "./terminal/Terminal";
import System from "./system/System";

const socket = new Socket()
export { socket }

const terminal = new Terminal()
export { terminal }

const system = new System()
export { system }