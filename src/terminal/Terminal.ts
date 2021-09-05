import chalk from "chalk";
import { utils } from "../Main";
import Stdin from "./Stdin";
import Tag from "./Tag";
import Animation, { AnimationOptions } from "./Animation";

export default class Terminal {
	public stdin = new Stdin();
	public tag = new Tag();
    public prefix? = "";
	public charset = { 
		logIcon: "•", 
		stateColors: {
			success: "#50ffab",
			warning: "#ff9900",
			error: "#ff5555",
			info: "#60ffab"
		} 
	};

    private animationStore: { [ index: string ]: Animation } = {};

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

	public animate(options: AnimationOptions): Animation {
        return new Animation(options, this.animationStore);
	}

    public getAnimation(referenceName: string): Animation {
        if (this.animationStore.hasOwnProperty(referenceName)) {
            return this.animationStore[referenceName];
        }

        throw new Error(`No animation with the reference name "${referenceName}" currently exists`);
    }

	public header(title: string) {
		console.log(chalk.bold(title))
	}

	public hr() {
		let columns = process.stdout.columns
		console.log(this.hex("#555", "─".repeat(columns)))
	}
}