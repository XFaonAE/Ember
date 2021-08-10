import Socket from "./socket/Socket";
import Terminal from "./terminal/Terminal";
import System from "./system/System";
import Gui from "./gui/Gui";
import Command from "./command/Command";
import Macros from "./macros/Macros";
import Utils from "./utils/Utils";
import WebServer from "./webServer/WebServer";
import Sql from "./sql/Sql";

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

const macros = new Macros();
export { macros };

const utils = new Utils();
export { utils };

const webServer = new WebServer();
export { webServer };

const sql = new Sql();
export { sql };