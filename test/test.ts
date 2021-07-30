import {socket, terminal} from "../src/Main";
import ServerConnection from "../src/socket/server/ServerConnection";

const server = socket.createServer({
    port: 8080
})

if (!server.config.ssl) {
    terminal.warning("Server is not using an SSL system")
}

server.on("ready", () => {
    terminal.log("Server is ready")
})

server.on("open", (connection: ServerConnection) => {
    setTimeout(() => {
        connection.reject()
    }, 1000)

    connection.on("accept", () => {
        terminal.log("Connection accepted")
    })

    connection.on("reject", () => {
        terminal.error("Connection rejected")
    })
})

server.run()