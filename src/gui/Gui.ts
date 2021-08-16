import { terminal, utils } from "../Main";
import Runner from "./Runner";

export interface AppOptions {
    /**
     * Dev server config
     */
    dev?: {
        /**
         * Server configuration
         */
        server?: {
            /**
             * Server port
             */
            port?: number;
        };

        /**
         * Project configuration
         */
        project?: {
            /**
             * Project root path
             */
            root?: string;
        };
    };

    /**
     * VueJS dev handle options
     */
    vue?: {
        skip?: boolean;
    };

    /**
     * ElectronJS dev handle options
     */
    electron?: {
        /**
         * Time to restart after an electron source file was edited
         */
        saveRestartTime?: number;

        /**
         * Log full output from ElectronJS
         */
        log?: boolean;

        /**
         * Skip this process
         */
        skip?: boolean;
    };
}

export default class Gui {
    /**
     * App dev server config
     */
    public config: AppOptions = {};

    /**
     * Instance runner class object
     */
    public runner: Runner = new Runner();

    /**
     * @param options Dev server options
     * @returns void
     */
    public constructor(options: AppOptions | false = false) {
        if (options) {
            const defaultOptions: AppOptions = {
                electron: {
                    saveRestartTime: 1000,
                    log: false,
                    skip: false
                },
                vue: {
                    skip: false
                },
                dev: {
                    server: {
                        port: 8080
                    },
                    project: {
                        root: process.cwd()
                    }
                }
            };

            this.config = utils.parseConfig(defaultOptions, options);
        }
    }

    /**
     * 
     * @param options Dev server options
     * @returns void
     */
    public create(options: AppOptions = {}) {
        return new Gui(options);
    }

    /**
     * Start the development server
     */
    public run() {
        this.runner.runVue(this.config, (host: string) => {
            this.runner.runElectron(this.config, host, () => {
                terminal.success("The app is running successfully at http://" + host);
            });
        });
    }
}