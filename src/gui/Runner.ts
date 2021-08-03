import { exec } from "child_process";
import { terminal } from "../Main";
import { AppOptions } from "./Gui";

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

                terminal.log("VueJS development server is ready");
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
        let service = exec("npx electron . http://" + host);
        let ready = false;

        const write = (data: string) => {
            switch (data) {
                case "dev-host-ready":
                    if (!ready) {
                        terminal.log("ElectronJS development app is ready");
                        ready = true;
                        callback();
                    }
                    break;

                case "dev-host-failed":
                    terminal.error("ElectronJS development app failed");
                    callback();
                    break;

                case "app-closed":
                    terminal.log("ElectronJS was closed, stopping development server");
                    process.exit(0);
            }
        }

        service.stdout?.on("data", (data: string) => write(data));
        service.stderr?.on("data", (data: string) => write(data));
    }
}