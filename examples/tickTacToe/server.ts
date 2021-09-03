import { socket, terminal } from "../../src/Main"
import ServerConnection from "../../src/socket/server/ServerConnection"

const api = socket.createServer({
	port: 1414,
	host: "localhost",
	nodes: [ {
		port: 1414,
		host: "localhost"
	} ]
})

api.on("run", () => {
	terminal.log("Server is starting")
})

api.on("ready", () => {
	terminal.log("Server is ready")
})

api.on("open", (connection: ServerConnection) => {
	connection.accept()
})

api.run()