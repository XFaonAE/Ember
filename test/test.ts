import { socket, terminal } from "../src/Main";
import ServerConnection from "../src/socket/server/ServerConnection";
import ClientConnection from "../src/socket/client/ClientConnection";

const server = socket.createServer({
    port: 1000,
    nodes: [
        {
            port: 1000,
            host: "localhost"
        },
        {
            port: 1100,
            host: "localhost"
        }
    ]
});

server.on("ready", () => {
    terminal.tag.info("All clusters has been created");

    server.on("open", (conn: ServerConnection) => {
        conn.accept()
    });
});

const serverr = socket.createServer({
    port: 1100,
    nodes: [
        {
            port: 1000,
            host: "localhost"
        },
        {
            port: 1100,
            host: "localhost"
        }
    ]
});

serverr.on("ready", () => {
    terminal.tag.info("All clusters has been created");

    serverr.on("open", (conn: ServerConnection) => {
        conn.accept();

        conn.on("message", (msg: any) => {
            server.connections.forEach((connS: any) => {
                serverr.nodeHelper.sendNetwork("localhost:1000", connS.id, {
                    hewwo: ">:3"
                }, "main");
            })
        }, "main")
    });
});

server.run();
serverr.run();

const child = socket.createClient({
    port: 1100
});

setTimeout(() => {
    child.on("open", (conn: ClientConnection) => {
        conn.send({
            msg: "Hello"
        }, "main");
    });

    child.run();

    const cl = socket.createClient({
        port: 1000
    })

    cl.on("open", (conn: ClientConnection) => {
        conn.on("message", (msg: any) => {
            console.log(msg)
        }, "main");
    });

    cl.run()
}, 1000);