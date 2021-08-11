import { sql, utils } from "../src/Main";

const server = sql.create({
    port: 3306,
    host: "localhost",
    database: "main",
    auth: {
        password: "root"
    }
});

server.on("open", () => {
    server.query.select({
        table: "_test_",
        columns: "*"
    }, (result: any) => {
        console.log(result);
    });
});

server.run();
