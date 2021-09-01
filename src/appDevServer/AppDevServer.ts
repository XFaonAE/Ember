import { ChildProcess, spawn } from "child_process";
import { terminal, utils } from "../Main";
import path from "path";
import chokidar from "chokidar";

export interface DevServerOptions {
    main?: string;
    root?: string;
    saveRestartTime?: number;
}

export default class AppDevServer {
    public config!: DevServerOptions;

    public constructor(options?: DevServerOptions) {
        if (options) {
            const config: DevServerOptions = utils.parseConfig({
                main: "./src/Main",
                root: process.cwd(),
                saveRestartTime: 1000
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
        const starterArgs = [ path.join(config.root!, config.main!), "--colors" ];
        let mainScript: ChildProcess;
        
        const attachListeners = () => {
            // mainScript.stdout?.on("data", (data: Buffer) => {
            //     process.stdout.write(data.toString());
            // });

            // mainScript.stderr?.on("data", (data: Buffer) => {
            //     process.stderr.write(data.toString());
            // });

            // TODO: Implement
            // mainScript.stdin?.on("data", (data: any) => {
            //     process.stdin.read(data);
            // });
        }

        const start = () => {
            mainScript = spawn("node", starterArgs, { stdio: [ process.stdin, process.stdout, process.stderr ] });
            attachListeners();
        }

        const restart = () => {
            mainScript?.kill();
            start();
        }

        terminal.log("Dev server main script started");

        let wait: NodeJS.Timer;
        let initTrue = false;

        const queue = () => {
            if (!initTrue) {
                initTrue = true;
                wait = setTimeout(() => {
                    restart();
                }, config.saveRestartTime);
                
                wait?.refresh();
                return;
            }

            wait?.refresh();
        }
        
        const watcher = chokidar.watch(config.root!);

        watcher.on("change", () => {
            queue();
        });

        watcher.on("unlink", () => {
            queue();
        });

        watcher.on("add", () => {
            queue();
        });

        terminal.log("Dev server auto restart loop started");
    }
}