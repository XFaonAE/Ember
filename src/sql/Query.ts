import { Connection } from "mysql";
import { utils } from "../Main";

export interface QueryRestrict {
    limit?: number | null;
}

export interface SelectQuery {
    table: string;
    columns: string[];
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
                columns: [],
                restrict: {
                    limit: null
                },
                beans: {
                    a: "old"
                }
            } as SelectQuery, {
                table: "",
                columns: [],
                restrict: {
                    limit: 1
                },
                beans: {
                    a: "new"
                }
            });

            console.log(config)
            const sqlQuery = this.addRestrict("SELECT ?? FROM ??", config.restrict ? config.restrict : {});

            console.log(sqlQuery);
        });
    }

    public addRestrict(sqlQuery: string, options: QueryRestrict): string {
        let query = sqlQuery;

        if (options.limit) {
            query += " LIMIT " + options.limit
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