import { utils } from "../Main";

export interface ParseOptions {
    flag?: {
        default?: any;
        parseBoolean?: boolean;
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
        const config = utils.parseConfig({
            flag: {
                default: true,
                parseBoolean: true
            }
        } as ParseOptions, options);

        console.log(config);

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
                        console.log(config)
                        if (config.flag?.parseBoolean) {
                            if (flag[2].toLowerCase() == "true") {
                                value = true;
                            } else if (flag[2].toLowerCase() == "false") {
                                value = false;
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

        return result;
    }

    public run(trigger: string, args: string[], flags: RunEventOptions["flags"]) {
        const command = this.getCommand(trigger);
        const options = command?.options;
        const callback = command?.callback ? command?.callback : () => {};

        callback(args, flags);
    }

    public setInputMode(mode: "process", parserOptions: ParseOptions = {}) {
        switch (mode) {
            case "process":
                const args = process.argv.splice(2);
                const parsed = this.parse(args.join(" "), parserOptions)!;
                
                this.run(parsed.trigger, parsed.args, parsed.flags);
                break;
        }
    }
}
