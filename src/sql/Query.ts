import { Connection } from "mysql"

export interface MetaData {}

export default class Query {
    public connection: Connection
    public ready = false

    public constructor(connection: Connection) {
        this.connection = connection
    }

    public readySet() {
        if (!this.ready) {
            this.ready = true
        }
    }

    public run(query: string, values: string[] | number[], callback: (error: any, results: any[] | null, metaData: MetaData | null) => void = () => {}) {
        if (this.ready) {
            this.connection.query(query, values, (error: any, results: any, fields: any) => {
                if (error) {
                    callback(error, null, null)
                    return
                }

                const result = [] as any[]

                if (Array.isArray(results)) {
                    results.forEach((resultSingle: any) => {
                        result.push({ ...resultSingle })
                    })

                    callback(null, result, fields)
                    return
                }

                callback(null, null, null)
            })

            callback(null, null, null)
            return
        }

        callback(new Error("Database connection is not ready"), null, null)
    }
}