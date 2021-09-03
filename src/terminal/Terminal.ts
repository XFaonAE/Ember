import chalk from "chalk";
import { utils } from "../Main";
import Stdin from "./Stdin";
import Tag from "./Tag";
import hideTerminalCursor from "hide-terminal-cursor";

export interface Animation {
	state?: "error" | "warning" | "success" | "info"
	interval?: number
	message?: string
	frames?: string[]
}

export default class Terminal {
    public tag = new Tag();
    public Stdin = new Stdin();
	public charset = { 
		logIcon: "•", 
		stateColors: {
			success: "#50ffab",
			warning: "#ff9900",
			error: "#ff5555",
			info: "#60cdff"
		} 
	}
	public prefix? = ""
	public animation = { running: false, config: {} as Animation, loop: null as any, frame: 0, message: "", ending: false, write: false }

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
		return chalk.hex(hex)(text)
	}

	public bgHex(hex: string, text: string) {
		return chalk.bgHex(hex)(text)
	}

	public row(key: string, value: string) {
		console.log(this.prefix + " " + this.hex("#74bddd", key) + "  -  " + value)
	}

	public setPrefix(prefix: string) {
		this.prefix = prefix
	}

	public animate(message: string, options: Animation = {}, callback: (error: any) => void = () => {}) {
		if (this.animation.running) {
			callback(new Error("An animation is already running"))
			return
		}

		this.animation.running = true
		this.animation.message = message
		hideTerminalCursor()

		const config: Animation = utils.parseConfig({
			interval: 100,
			state: "info",
			frames: [
				"|",
				"/",
				"-",
				"\\"
			]
		} as Animation, options)
		this.animation.config = { ...config }

		this.animation.loop = () => {
			this.animation.write = true;
			const icon = this.hex(this.charset.stateColors[this.animation.config.state ?? "info"], config.frames![this.animation.frame]);

			process.stdout.write(`\r${icon}  ${this.animation.message}`);

			setTimeout(() => {
				if (this.animation.ending) {
					this.animation.ending = false;
					this.animation.write = false;
					return;
				}

				this.animation.frame++;

				if (this.animation.frame > this.animation.config.frames!.length - 1) {
					this.animation.frame = 0;
				}

				this.animation.loop();
			}, config.interval);
		}

		this.animation.loop();
	}

	public endAnimation(newMessage?: string | null, state?: Animation["state"] | null) {
		if (state) {
			this.animation.config.state = state
		}

		let overflow = 0
		if (newMessage) {
			overflow = this.animation.message.length - newMessage.length
		}

        if (overflow < 0) {
            overflow = 0
        }

		let message = newMessage
		if (!message) {
			message = this.animation.message
		}

		this.animation.ending = true
		process.stdout.write(`\r${this.hex(this.charset.stateColors[this.animation.config.state ?? "info"], this.charset.logIcon)}  ${message}${" ".repeat(overflow)}\n`)
	}

	public header(title: string) {
		console.log(chalk.bold(title))
        this.hr();
	}

	public hr() {
		let columns = process.stdout.columns
		console.log(this.hex("#555", "─".repeat(columns)))
	}
}