import { utils } from "../Main";
import mySql, { Connection } from "mysql";
import Query from "./Query";

export interface Options {
    port: number;
    host: string;
    database?: string;
    auth?: {
        user?: string;
        password?: string;
    }
}

export default class Sql {
    public config!: Options;
    public connection!: Connection;
    public events: any = { open: [], error: [] };
    public query!: Query; 

    public constructor(options?: Options) {
        if (options) {
            this.config = utils.parseConfig({
                port: 3306,
                host: "localhost",
                database: undefined,
                auth: {
                    user: "root",
                    password: ""
                }
            } as Options, options);

            this.connection = mySql.createConnection({
                port: this.config.port,
                host: this.config.host,
                user: this.config.auth!.user,
                password: this.config.auth!.password,
                database: this.config.database
            });

            this.query = new Query(this.connection);

            this.on("open", () => {
                this.query.readySet();
            });
        }
    }

    public create(options: Options) {
        return new Sql(options);
    }

    public run() {
        this.connection.connect((error: any) => {
            if (error) {
                this.events.error.forEach((event: any) => event(new Error("Failed to connect to database")));
                return;
            }

            this.events.open.forEach((event: any) => event());
        });
    }

    public on(event: "open", callback: () => void): void;
    public on(event: "error", callback: (error: any) => void): void;

    public on(event: any, callback: any) {
        this.events[event].push(callback);
    }
}