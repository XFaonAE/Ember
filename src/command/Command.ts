export interface ParseOptions {
    flag?: {
        default?: any;
    }
}

export interface RunEventOptions {
    triggers: string[];
    flags?: {
        [ index: string ]: string;
    };
}

export default class Command {
    public events: { [ index: string ]: any } = { run: [] };

    public on(event: "run", callback: (args: string[], flags: any) => any, options: RunEventOptions): void;

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

    public getCommand(trigger: string): {
        options: RunEventOptions,
        callback: (args: string[], flags: any) => any
    } | undefined {
        let result: any;

        this.events.run.forEach((command: any) => {
            command.options.triggers.forEach((singleTrigger: string) => {
                if (singleTrigger == trigger) {
                    result = command;
                }
            });
        });

        return result;
    }

    public parse(fullCommand: string, options: ParseOptions = {}): { trigger: string, args: string[], flags: { [index: string]: any } } | undefined {
        if (fullCommand.length == 0) {
            throw new Error("Command must be larger than 0 characters");
        }
        
        const defaultOptions: ParseOptions = {
            flag: {
                default: true
            }
        }

        const config = { ...defaultOptions, ...options };
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
                    const flag = /--([^"]+)=([^"]+)/.exec(chunk);
                    if (flag) {
                        result.flags[flag[1]] = flag[2];
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

            result.args.push(chunk);
        });

        return result;
    }

    public run(trigger: string, args: string[], flags: RunEventOptions["flags"]) {
        const command = this.getCommand(trigger);
        const options = command?.options;
        const callback = command?.callback ? command?.callback : () => {};

        callback(args, flags);
    }
}
