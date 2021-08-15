import { terminal, utils } from "../Main";
import Runner from "./Runner";
export interface AppOptions {
    port?: number;
    skip?: {
        vue?: boolean;
        electron?: boolean;
    };
    electron?: {
        saveRestartTime?: number;
        log?: boolean;
    };
}

export default class Gui {
    public config: AppOptions = {};
    public runner: Runner = new Runner();

    public constructor(options: AppOptions | false = false) {
        if (options) {
            const defaultOptions: AppOptions = {
                port: 8080,
                skip: {
                    vue: false,
                    electron: false
                },
                electron: {
                    saveRestartTime: 1000,
                    log: false
                }
            };

            this.config = utils.parseConfig(defaultOptions, options);

            this.runner.runVue(this.config, (host: string) => {
                this.runner.runElectron(this.config, host, () => {
                    terminal.success("The app is running successfully at http://" + host);
                });
            });
        }
    }

    public create(options: AppOptions = {}) {
        return new Gui(options);
    }
}