import Socket from "./socket/Socket";
import Terminal from "./terminal/Terminal";
import System from "./system/System";
import Gui from "./gui/Gui";
import Command from "./command/Command";

const socket = new Socket();
export { socket };

const terminal = new Terminal();
export { terminal };

const system = new System();
export { system };

const gui = new Gui();
export { gui };

const command = new Command();
export { command };