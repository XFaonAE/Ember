import { webServer } from "../src/Main";

const server = webServer.create({
    port: 8080,
    host: "localhost"
});

server.on("get", "/", (end: any) => {
    
    
    end();
});

server.run();