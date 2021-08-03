import { terminal } from "../Main";
import Runner from "./Runner";

export interface AppOptions {
    port?: number;
    skip?: {
        vue?: boolean;
        electron?: boolean;
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
                }
            };

            this.config = { ...defaultOptions, ...options };

            this.runner.runVue(this.config, (host: string) => {
                this.runner.runElectron(this.config, host, () => {
                    
                });
            });
        }
    }

    public create(options: AppOptions = {}) {
        return new Gui(options);
    }
}