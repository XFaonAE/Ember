"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../src/Main");
const server = Main_1.socket.createServer({
    port: 8080
});
if (!server.config.ssl) {
    Main_1.terminal.warning("Server is not using an SSL system");
}
server.on("ready", () => {
    Main_1.terminal.log("Server is ready");
});
server.on("open", (connection) => {
    setTimeout(() => {
        connection.reject();
    }, 1000);
    connection.on("accept", () => {
        Main_1.terminal.log("Connection accepted");
    });
    connection.on("reject", () => {
        Main_1.terminal.error("Connection rejected");
    });
});
server.run();
//# sourceMappingURL=test.js.map