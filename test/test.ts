import {socket, terminal} from "../src/Main";
import SocketServer from "../src/socket/server/SocketServer";
import ServerConnection from "../src/socket/server/ServerConnection";
import { SocketMessage } from "../src/socket/Socket";
import http, { IncomingMessage, ServerResponse } from "http";
import * as fs from "fs";
import path from "path";

function getHtml(file: string) {
    return fs.readFileSync(path.join(__dirname, "./examples/chat/" + file + ".html"))
}

http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url == "/register") {
        res.write(getHtml("Register"))
    }

    if (req.url == "/login") {
        res.write(getHtml("Login"))
    }

    if (req.url == "/") {
        res.write(getHtml("Chat"))
    }

    if (req.url == "/wjs") {
        res.write(fs.readFileSync(path.join(__dirname, "./examples/chat/socket.js")));
    }

    res.end()
}).listen(8080)

const db: {[index: string]: any} = {
    users: {
        "": {
            password: "",
            token: "that-weird-user"
        },
        "xfaon": {
            password: "",
            token: "xfaon-account"
        }
    },
    online: {}
}

function logic(server: SocketServer) {
    server.on("open", (conn: ServerConnection) => {
        conn.on("accept", () => {
            conn.on("message", (msg: SocketMessage) => {
                console.log(msg)
            }, "user:register")

            conn.on("message", (msg: SocketMessage, reply: any) => {
                terminal.log("New user login request")

                if (db.users[msg.user] && db.users[msg.user].password == msg.password) {
                    terminal.success("Successful login for user='" + msg.user + "'")
                    reply({
                        token: db.users[msg.user].token
                    })

                    db.online[db.users[msg.user].token] = {
                        node: server.config.host + ":" + server.config.port,
                        client: conn.id
                    }
                } else {
                    reply({
                        error: "Invalid user info"
                    })
                }
            }, "user:login")

            conn.on("message", (msg: SocketMessage, reply: any) => {
                let user: any
                for (const use in db.users) {
                    if (db.users[use].token == msg.token) {
                        user = {
                            name: use,
                            user: db.users[use]
                        }
                    }
                }

                db.online[user.user.token] = {
                    node: server.config.host + ":" + server.config.port,
                    client: conn.id
                }

                terminal.log("CHAT -> " + user.name + " -> " + msg.msg)

                for (let online in db.online) {
                    const onlineU = db.online[online]

                    server.connectionManager.sendNetwork(onlineU.node, onlineU.client, {
                        message: msg.msg,
                        user: user.name
                    },  "chat:send")
                }
            }, "chat:send")
        })

        conn.accept()
    })
}

const one = socket.createServer({
    port: 1000,
    accessInfo: {
        user: "",
        password: ""
    },
    cluster: [
        {
            port: 1000,
            host: "localhost",
            user: "",
            password: ""
        },
        {
            port: 1100,
            host: "localhost",
            user: "",
            password: ""
        }
    ]
})

one.on("ready", () => {
    terminal.log("Socket Server one is ready")
})

logic(one)
one.run()

const two = socket.createServer({
    port: 1100,
    accessInfo: {
        user: "",
        password: ""
    },
    cluster: [
        {
            port: 1000,
            host: "localhost",
            user: "",
            password: ""
        },
        {
            port: 1100,
            host: "localhost",
            user: "",
            password: ""
        }
    ]
})

two.on("ready", () => {
    terminal.log("Socket Server two is ready")
})

logic(two)
two.run()