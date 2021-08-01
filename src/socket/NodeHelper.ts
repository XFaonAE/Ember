import { ServerNode } from "./server/SocketServer";
import {socket} from "../Main";
import ClientConnection from "./client/ClientConnection";

export default class NodeHelper {
    public connect(nodes: ServerNode[]) {
        nodes.forEach((nodeConfig: ServerNode) => {
            const node = socket.createClient({
                port: nodeConfig.port,
                host: nodeConfig.host
            });

            node.on("open", (conn: ClientConnection) => {
                node.send({
                    user: nodeConfig.auth?.user,
                    password: nodeConfig.auth?.password
                }, "nodeAccess");
            })

            node.run()
        });
    }
}