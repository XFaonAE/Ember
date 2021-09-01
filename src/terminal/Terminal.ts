import chalk from "chalk";
import { utils } from "../Main";
import Stdin from "./Stdin";
import Tag from "./Tag";
import hideTerminalCursor from "hide-terminal-cursor";

export interface Animation {
    state?: "error" | "warning" | "success" | "info";
    interval?: number;
    message?: string;
    frames?: string[];
}

export default class Terminal {
    public stdin = new Stdin();
    public tag = new Tag();
    public charset = { 
        logIcon: "•", 
        stateColors: {
            success: "#50ffab",
            warning: "#ff9900",
            error: "#ff5555",
            info: "#60ffab"
        } 
    };
    public prefix? = "";
    public animation = { running: false, config: {} as Animation, loop: null as any, frame: 0, message: "", ending: false, endCallback: () => {} };

    public log(message: string) {
        console.info(this.prefix + (this.prefix ? "  " : "") + chalk.hex(this.charset.stateColors.info)(this.charset.logIcon) + "  " + message)
    }

    public error(message: string) {
        console.error(this.prefix + (this.prefix ? "  " : "") + chalk.hex(this.charset.stateColors.error)(this.charset.logIcon) + "  " + message)
    }

    public success(message: string) {
        console.log(this.prefix + (this.prefix ? "  " : "") + chalk.hex(this.charset.stateColors.success)(this.charset.logIcon) + "  " + message)
    }

    public warning(message: string) {
        console.warn(this.prefix + (this.prefix ? "  " : "") + chalk.hex(this.charset.stateColors.warning)(this.charset.logIcon) + "  " + message)
    }

    public hex(hex: string, text: string) {
        return chalk.hex(hex)(text);
    }

    public bgHex(hex: string, text: string) {
        return chalk.bgHex(hex)(text);
    }

    public row(key: string, value: string) {
        console.log(this.prefix + " " + this.hex("#74bddd", key) + "  -  " + value)
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
    }

    public animate(message: string, options: Animation = {}, callback: (error: any) => void = () => {}) {
        if (this.animation.running) {
            callback(new Error("An animation is already running"));
            return;
        }

        this.animation.running = true;
        this.animation.message = message;
        hideTerminalCursor();

        const config: Animation = utils.parseConfig({
            interval: 100,
            state: "info",
            frames: [
                "|",
                "/",
                "-",
                "\\"
            ]
        } as Animation, options);

        this.animation.config = config;

        this.animation.loop = setInterval(() => {
            this.animation.frame++;

            if (this.animation.frame > config.frames!.length - 1) {
                this.animation.frame = 0;
            }

            let loaderIcon = this.hex(this.charset.stateColors[config.state ?? "info"], config.frames![this.animation.frame]);

            if (this.animation.ending) {
                loaderIcon = this.hex(this.charset.stateColors[config.state ?? "info"], this.charset.logIcon);
                clearInterval(this.animation.loop);
            }

            process.stdout.write(`\r${loaderIcon}  ${this.animation.message} ${(this.animation.ending ? "\n" : "")}`);

            if (this.animation.ending) {
                this.animation.endCallback();
                this.animation.ending = false;
            }
        }, config.interval);
    }

    public endAnimation(newMessage?: string | null, state?: Animation["state"] | null, callback: () => void = () => {}) {
        this.animation.endCallback = callback;

        if (state) {
            this.animation.config.state = state;
        }

        this.animation.ending = true;
        this.animation.running = false;
    }

    public header(title: string) {
        console.log(chalk.bold(title));
    }

    public hr() {
        let columns = process.stdout.columns;

        console.log(columns);
    }
}