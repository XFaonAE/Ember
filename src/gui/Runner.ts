import { ChildProcess, exec, spawn } from "child_process";
import path from "path";
import { terminal } from "../Main";
import { AppOptions } from "./Gui";
import chokidar from "chokidar";

export default class Runner {
    public runVue(config: AppOptions, callback: (host: string) => any) {
        if (config.skip?.vue) {
            terminal.warning("Skipping VueJS development server");
            callback("");
            return;
        }

        terminal.log("Starting VueJS development server...");
        const service = exec("npx vue-cli-service serve " + (config.port ? "--port=" + config.port : ""));
        let ready = false;

        const write = (data: string) => {
            if (!ready && /Local:\s{3}http:\/\/(.*?)\/ /.exec(data)) {
                ready = true;
                
                const matchData = /Local:\s{3}http:\/\/(.*?)\/ /.exec(data);
                const devLocation = matchData ? matchData[1] : "localhost";

                callback(devLocation);
            }  
        }

        service.stdout?.on("data", (data: string) => write(data));
        service.stderr?.on("data", (data: string) => write(data));
    }

    public runElectron(config: AppOptions, host: string, callback: () => any) {
        if (config.skip?.electron) {
            terminal.warning("Skipping ElectronJS development app");
            callback();
            return;
        }

        terminal.log("Starting ElectronJS development app...");

        let ready = false;
        const electronMeta = exec("node " + path.join(process.cwd(), "./src/electron/GetExe.js"));
        electronMeta.stdout?.on("data", (data: string) => {
            const electronExe = data.replace(new RegExp(/\n/, "g"), "");
            let service: null | ChildProcess = null;
            let restarting = false;

            const restart = () => {
                service?.kill();
                start();
            }

            const watchRestart = () => {
                const electronDir = chokidar.watch(path.resolve(process.cwd(), "./src/electron/"));

                let wait: NodeJS.Timer;
                let initTrue = false;

                const queue = () => {
                    if (!initTrue) {
                        initTrue = true;
                        wait = setTimeout(() => {
                            restart();
                        }, config.electron?.saveRestartTime);
                        
                        wait?.refresh;
                        return;
                    }

                    wait?.refresh();
                }

                electronDir.on("change", () => queue());
            }

            const write = (data: string) => {
                if (config.electron?.log) {
                    process.stdout.write(data);
                }

                switch (data) {
                    case "dev-host-ready":
                        if (!ready) {
                            ready = true;

                            watchRestart();
                            callback();
                        }
                        break;

                    case "dev-host-failed":
                        if (!ready) {
                            ready = true;
                            terminal.error("ElectronJS development app failed");

                            watchRestart();
                            callback();
                        }
                        break;

                    case "app-closed":
                        if (!restarting) {
                            terminal.log("ElectronJS was closed, stopping development server");
                            process.exit(0);
                        }
                }
            }

            const start = () => {
                service = spawn(electronExe, [ ".", "http://" + host ], {
                    cwd: process.cwd()
                });

                service.stdout?.on("data", (data: any) => write(data.toString()));
                service.stderr?.on("data", (data: any) => write(data.toString()));
            }

            start();
        });
    }
}