import mySql, { Connection } from "mysql";
import { utils } from "../Main";

export interface QueryRestrict {
    limit?: number | null;
}

export interface InsertQuery {
    table: string;
    data: [{
        column: string;
        value: string;
    }, ...{
        column: string;
        value: string;
    }[]];
    restrict?: QueryRestrict;
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

    public parsePlaceholders(group: string[], placeholder: "?" | "??" = "??"): string {
        let placeholders = "";
        let placeholderArray: string[] = [];

        if (group.length == 1) {
            placeholders = placeholder;
        } else if (group.length > 1) {
            group.forEach((cell: string) => placeholderArray.push(placeholder));
        }

        placeholders = placeholderArray.join(", ");
        return placeholders;
    }

    public cleanResult(result: any): any[] {
        const newResult: any[] = [];

        result.forEach((record: any) => {
            newResult.push({ ...record });
        });

        return newResult;
    }

    public insert(options: InsertQuery) {
        this.isReady((error: ahy) => {
            if (error) {
                console.error(error);
                return;
            }

            this.connection.query(this.parseInsert(options));
        });
    }

    public parseInsert(options: InsertQuery): string {
        const config: InsertQuery = utils.parseConfig({
            table: "",
            data: [
                {
                    column: "",
                    value: ""
                }
            ],
            restrict: this.restrictDefaults
        } as InsertQuery, options);

        let allColumns: string[] = [];
        let allValues: string[] = [];

        config.data.forEach((columnGroup: any, index: number) => {
            allColumns.push(columnGroup.column);
            allValues.push(columnGroup.value);
        });

        let values: any[] = [ config.table, ...allColumns, ...allValues ];

        const columnValuePlaceholders = this.parsePlaceholders(allColumns, "?");
        const columnColumnPlaceholders = this.parsePlaceholders(allColumns);

        let sqlQuery = this.addRestrict(`INSERT INTO ?? (${columnColumnPlaceholders}) VALUES (${columnValuePlaceholders})`, <QueryRestrict>config.restrict, values);
        const finalQuery = mySql.format(sqlQuery, values, true);

        return finalQuery;
    }

    public select(options: SelectQuery, callback: (result: any[]) => any) {
        this.isReady((error: any) => {
            if (error) {
                console.error(error);
                return;
            }

            this.connection.query(this.parseSelect(options), (error: any, result: any) => {
                if (!error) {
                    callback(this.cleanResult(result));
                }
            }); 
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
                renderColumns = this.parsePlaceholders(config.columns);
            })();
        } else {
            if (<string>config.columns == "*") {
                renderColumns = "*";
            } else {
                renderColumns = mySql.escape(<string>config.columns);
            }
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

    private isReady(callback: (error: any) => any) {
        if (this.ready) {
            callback(null);
            return;
        }

        callback(new Error("The database connection is not ready"));
    }
}