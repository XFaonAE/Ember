import { socket } from "../src/Main";
import ServerConnection from "../src/socket/server/ServerConnection";

const server = socket.createServer({
    port: 1000,
    nodes: [
        {
            port: 1000,
            host: "localhost"
        }
    ]
});

server.on("open", (conn: ServerConnection) => {
    console.log("new connection")
    conn.accept()
});

server.run();