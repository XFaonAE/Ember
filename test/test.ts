import { sql, terminal } from "../src/Main";

terminal.animate("Connecting to database server");

const db = sql.create({
    port: 3306,
    host: "localhost",
    database: "axeri"
});

db.on("open", () => {
    terminal.endAnimation("Connected to database", "success");

    db.query.insert({
        table: "accounts",
        data: [
            {
                column: "name",
                value: "Test"
            }
        ]
    });
});

db.on("error", (error: any) => {
    terminal.endAnimation(error, "error");
});

db.run();