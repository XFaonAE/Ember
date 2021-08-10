import { sql } from "../src/Main";

const server = sql.create({
    port: 3306,
    host: "localhost",
    auth: {
        password: "root"
    }
});

server.run();

