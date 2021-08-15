import { utils } from "../Main";

export interface ParseOptions {
    /**
     * Options for command flag parsing
     */
    flag?: {
        /**
         * Default flag value if no value is provided for a flag
         */
        default?: any;

        /**
         * Convert flag string values "true" / "false" to booleans
         */
        parseBoolean?: boolean;
    };
}

export interface RunEventOptions {
    /**
     * Command triggers
     */
    triggers: string[];

    /**
     * Command flags
     */
    flags?: {
        [ index: string ]: string;
    };
}

export interface GetCommandReturn {
    options: RunEventOptions;
    callback: (args: string[], flags: any) => void;
}

export interface ParseCommandResult { 
    trigger: string; 
    args: string[]; 
    flags: { 
        [index: string]: any;
    };
}
export default class Command {
    /**
     * Command event handler storage
     */
    public events: { [ index: string ]: any } = { run: [] };

    public on(event: "run", callback: (args: string[], flags: any) => void, options: RunEventOptions): void;

    /**
     * 
     * @param event Event name
     * @param callback Event trigger callback action
     * @param options Event handler options
     * @returns void
     */
    public on(event: any, callback: any, options?: any) {
        if (event == "run") {
            this.events.run.push({
                options: options,
                callback: callback
            });

            return;
        }

        this.events[event].push(callback);
    }

    /**
     * Get a command object
     * @param trigger Command trigger
     * @param callback Command match callback
     * @returns void
     */
    public async getCommand(trigger: string, callback: (result: GetCommandReturn) => void) {
        let result: any;

        this.events.run.forEach((command: any) => {
            command.options.triggers.forEach((singleTrigger: string) => {
                if (singleTrigger == trigger) {
                    result = command;
                }
            });
        });

        callback(result);
    }

    public async parse(fullCommand: string, callback: (commandResult: ParseCommandResult) => void, options: ParseOptions = {}) {    
        const config = utils.parseConfig({
            flag: {
                default: true,
                parseBoolean: true
            }
        } as ParseOptions, options);

        const chunks = fullCommand.split(" ");
        const result: { trigger: string, args: string[], flags: { [ index: string ]: any } } = { trigger: chunks[0], args: [], flags: {} };

        const getType = (chunk: string): "flag" | "flag-full" | "arg" => {
            if (chunk.startsWith("--")) {
                return "flag-full";
            } else if (chunk.startsWith("-")) {
                return "flag";
            }

            return "arg";
        }

        chunks.shift();
        chunks.forEach((chunk: string) => {
            if (getType(chunk) == "flag-full") {
                if (/--([^"]+)=([^"]+)/.test(chunk)) {
                    let value: any;
                    const flag = /--([^"]+)=([^"]+)/.exec(chunk);

                    if (flag) {
                        if (config.flag?.parseBoolean) {
                            if (flag[2].toLowerCase() == "true") {
                                value = true;
                            } else if (flag[2].toLowerCase() == "false") {
                                value = false;
                            } else {
                                value = flag[2];
                            }
                        } else {
                            value = flag[2];
                        }

                        result.flags[flag[1]] = value;
                    }
                } else if (/--([^"]+)/) {
                    const flag = /--([^"]+)/.exec(chunk);
                    if (flag) {
                        result.flags[flag[1]] = config.flag?.default;
                    }
                }

                return;
            } else if (getType(chunk) == "flag") {
                const flag = /-([^"]+)/.exec(chunk);
                if (flag) {
                    result.flags[flag[1]] = config.flag?.default;
                }

                return;
            }

            result.args.push(chunk.toLowerCase());
        });

        callback(result);
    }

    public run(trigger: string, args: string[], flags: RunEventOptions["flags"]) {
        this.getCommand(trigger, (command) => {
            const callback = command?.callback ? command?.callback : () => {};
            callback(args, flags);
        });
    }

    public setInputMode(mode: "process", parserOptions: ParseOptions = {}) {
        switch (mode) {
            case "process":
                const args = process.argv.splice(2);

                this.parse(args.join(" "), (result: ParseCommandResult) => {
                    this.run(result.trigger, result.args, result.flags);
                }, parserOptions);
                break;
        }
    }
}
