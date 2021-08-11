import { ServerNode, ServerOptions } from "./server/SocketServer";
import { socket, terminal } from "../Main";
import ClientConnection from "./client/ClientConnection";

export default class NodeHelper {
    public connectedAll = false;
    public nodes: ClientConnection[] = [];

    public connect(nodes: ServerNode[], config: ServerOptions, callback: () => any) {
        let connected = 0;
        const count = nodes.length;

        nodes.forEach((nodeConfig: ServerNode) => {
            const connect = () => {
                const node = socket.createClient({
                    port: nodeConfig.port,
                    host: nodeConfig.host
                });

                node.on("open", (conn: ClientConnection) => {
                    const next = () => {
                        connected++;

                        if (count == connected) {
                            this.connectedAll = true;
                            callback();
                            return;
                        }
                    }

                    conn.send({
                        user: nodeConfig.auth?.user,
                        password: nodeConfig.auth?.password
                    }, "nodeAccess");

                    conn.on("message", (message: any) => {
                        if (message.token && nodeConfig.logStats) {
                            terminal.tag.success("Access granted to node: " + nodeConfig.host + (nodeConfig.port ? ":" + nodeConfig.port : ""));
                        }

                        if (message.token) {
                            conn.props.id = nodeConfig.host + (nodeConfig.port ? ":" + nodeConfig.port : "");
                            this.nodes.push(conn);
                            conn.props.token = message.token;
                            conn.props.node = true;
                            next();
                        }
                    }, "nodeAccess");

                    conn.on("message", (message: any) => {
                        if (message.error) {
                            let errorMessage = "Undefined error";

                            switch (message.error) {
                                case 1000:
                                    errorMessage = "Invalid credentials"
                                    break;
                            }

                            if (nodeConfig.logStats) {
                                terminal.tag.error(errorMessage);
                                terminal.tag.error("The connection to the server has been closed");
                                terminal.tag.error("Failed to get node control token");
                            }
                        }
                    }, "close");
                });

                node.on("error", () => {
                    setTimeout(() => {
                        if (nodeConfig.logStats) {
                            terminal.tag.warning("A node failed to connect, reconnecting. Note this is normal to happen");
                            terminal.tag.warning("Debug Info: connecting-to = " + nodeConfig.host + (nodeConfig.port ? ":" + nodeConfig.port : "") + " at = " + config.host + (config.port ? ":" + config.port : ""));
                        }
                        connect();
                    }, 300);
                });

                node.run();
            }

            connect();
        });
    }

    public getNodeConnection(nodeId: string): ClientConnection|undefined {
        let returnValue: any;

        this.nodes.forEach((node: ClientConnection) => {
            if (node.props.id == nodeId) {
                returnValue = node;
            }
        });

        return returnValue;
    }

    public sendNetwork(nodeId: string, client: string, message: { [index: string]: any }, channel: string) {
        const node = this.getNodeConnection(nodeId);

        node?.send({
            channel: channel,
            message: message,
            client: client,
            token: node.props.token
        }, "nodeSendClient");
    }
}