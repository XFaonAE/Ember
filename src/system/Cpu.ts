import os from "os-utils"

export default class Cpu {
	public getUsage(callback: (percent: number) => any) {
		os.cpuUsage((percent: number) => {
			let final: number|string
			let split = (percent + "").split("")
			split = [split[0], split[2], split[3]]

			if (+split[0] == 1) {
				final = 100
			} else {
				final = "" + (+split[1] !== 0 ? split[1] : "") + (+split[2] !== 0 ? split[2] : "")
			}

			callback(+final)
		})
	}
}