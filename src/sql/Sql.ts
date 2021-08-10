import { utils } from "../Main";
import mySql, { Connection } from "mysql";

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
    public config?: Options;
    public server?: Connection;

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

            this.server = mySql.createConnection({
                port: this.config?.port,
                host: this.config?.host,
                user: this.config?.auth?.user,
                password: this.config?.auth?.password,
                database: this.config?.database
            });
        }
    }

    public create(options: Options) {
        return new Sql(options);
    }

    public run() {
        this.server?.connect((error: any) => {
            console.log(error ? error : "No Errors");
        });
    }
}