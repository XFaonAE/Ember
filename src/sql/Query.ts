import mySql, { Connection } from "mysql";
import { utils } from "../Main";

export interface QueryRestrict {
    limit?: number | null;
}

export interface SelectQuery {
    table: string;
    columns: [ string, string, ...string[] ] | string;
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
            this.connection.query(this.parseSelect(options), (err: any, result: any) => console.log(result));
        });
    }

    public parseSelect(options: SelectQuery): string {
        const config: SelectQuery = utils.parseConfig({
            table: "",
            columns: "*",
            restrict: this.restrictDefaults
        } as SelectQuery, options);

        const values: any[] = [  ];
        let columnSingle = "";
        if (Array.isArray(config.columns)) {
            values.push(...config.columns);
        } else {
            columnSingle = config.columns;
        }

        values.push(config.table);
        let renderColumns = "";

        if (Array.isArray(config.columns) && config.columns.length > 1) {
            (() => {
                let placeholders: any[] = [];

                config.columns.forEach((column: string) => placeholders.push("??"));
                renderColumns = placeholders.join(", ");

                values.push(...config.columns);
            })();
        } else {
            renderColumns = config.columns;
        }

        const sqlQuery = this.addRestrict(`SELECT ${renderColumns} FROM ??`, config.restrict ? config.restrict : {}, values);
        const finalQuery = mySql.format(sqlQuery, values);

        return finalQuery;
    }

    public addRestrict(sqlQuery: string, options: QueryRestrict, values: any[]): string {
        let query = sqlQuery;

        if (options.limit !== null) {
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