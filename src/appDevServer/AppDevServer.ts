import { spawn } from "child_process";
import { terminal, utils } from "../Main";
import path from "path";

export interface DevServerOptions {
    main?: string;
    root?: string;
}

export default class AppDevServer {
    public config!: DevServerOptions;

    public constructor(options?: DevServerOptions) {
        if (options) {
            const config: DevServerOptions = utils.parseConfig({
                main: "./src/Main",
                root: process.cwd()
            } as DevServerOptions, options);

            this.config = config;
        }
    }

    public create(options: DevServerOptions = {}) {
        return new AppDevServer(options);
    }

    public run() {
        terminal.header("Ember General App Dev Server");

        const config = this.config;
        const mainScript = spawn("node", [ path.join(config.root!, config.main!) ]);

        mainScript.stdout.on("data", (data: Buffer) => {
            process.stdout.write(data.toString());
        });
    }
}