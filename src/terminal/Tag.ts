import { terminal } from "../Main"

export default class Tag {
	public info(message: string) {
		this.custom(message, "Info", "#74bddd")
	}

	public warning(message: string) {
		this.custom(message, "Warning", "#ffff55")
	}

	public error(message: string) {
		this.custom(message, "Error", "#ff5555")
	}

	public success(message: string) {
		this.custom(message, "Success", "#50ffab")
	}

	public custom(message: string, tag: string, hex: string) {
		console.log(terminal.bgHex(hex, terminal.hex("#000", "  " + tag + "  ")) +  "  " + message)
	}
}