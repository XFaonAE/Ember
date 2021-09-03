import { sql, terminal } from "../src/Main"

terminal.animate("Connecting to database server")

const db = sql.create({
    port: 3306,
    host: "localhost",
    database: "axeri"
})

db.on("open", () => {
    terminal.endAnimation("Connected to database", "success")

    db.query.run("UPDATE ?? SET name = ?, email = ?", [ "accounts", "OWO", "Email" ], (error: any, results: any) => {
        
        if (results) {
            console.log(results)
        } else if (error) {
            console.error(error)
        }
    })
})

db.on("error", (error: any) => {
    terminal.endAnimation(error, "error")
})

db.run()