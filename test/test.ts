import {socket, terminal} from "../src/Main";
import ServerConnection from "../src/socket/server/ServerConnection";

const server = socket.createServer({
    port: 8080,
    accessInfo: {
        user: "test-user",
        password: "test-password"
    },
    cluster: [
        {
            port: 8080,
            host: "localhost",
            user: "test-user",
            password: "test-password"
        }
    ]
})

if (!server.config.ssl) {
    terminal.warning("Server is not using an SSL system")
}

server.on("ready", () => {
    terminal.log("Server is ready")
})

server.on("open", (connection: ServerConnection) => {
    connection.accept()
})

server.run()