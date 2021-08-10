import mySql, { Connection } from "mysql";
import { utils } from "../Main";

export interface QueryRestrict {
    limit?: number | null;
}

export interface SelectQuery {
    table: string;
    columns: string[] | string;
    restrict?: QueryRestrict;
}

export default class Query {
    public connection: Connection;
    public ready = false;
    public restrictDefaults: QueryRestrict = {
        limit: null
    };

    public constructor(connection: Connection) {
        this.connection = connection;
    }

    public readySet() {
        if (!this.ready) {
            this.ready = true;
        }
    }

    public select(options: SelectQuery) {
        this.isReady(() => {
            const config: SelectQuery = utils.parseConfig({
                table: "",
                columns: "*",
                restrict: this.restrictDefaults
            } as SelectQuery, options);

            const values: any[] = [  ];
            if (Array.isArray(config.columns)) {
                values.push(...config.columns);
            }

            values.push(config.table);
            const sqlQuery = this.addRestrict(`SELECT ${Array.isArray(config.columns) ? "?? ".repeat(config.columns.length) : "* "}FROM ??`, config.restrict ? config.restrict : {}, values);
            const finalQuery = mySql.format(sqlQuery, values);

            console.log(finalQuery, values);
            this.connection.query(finalQuery, (err: any, result: any) => console.log(result));
        });
    }

    public addRestrict(sqlQuery: string, options: QueryRestrict, values: any[]): string {
        let query = sqlQuery;

        if (options.limit) {
            if (typeof options.limit == "number") {
                query += ` LIMIT ${options.limit}`;
            } else {
                query += " LIMIT ??";
                values.push(options.limit);
            }
        }

        return query;
    }

    private isReady(callback: () => any) {
        if (this.ready) {
            callback();
            return;
        }

        throw new Error("The database connection is not ready");
    }
}