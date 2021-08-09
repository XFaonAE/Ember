import { webServer } from "../src/Main";

const server = webServer.create({
    port: 8080,
    host: "localhost",
    notFound: {
        get: false
    }
});

server.on("get", (end: any) => {
    end();
}, "/");

server.on("get404", (end: any) => {
    console.log("Error 404");
    end();
});

server.run();