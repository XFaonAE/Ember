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
    console.log("The server has been connected");

    server.query.select({
        table: "_test_",
        columns: "*",
        restrict: {
            limit: 0
        }
    });
});

server.run();
