import {socket} from "../src/Main";

const server = socket.createServer({
    port: 8080
})

server.on("open", ())