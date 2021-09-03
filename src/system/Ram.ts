import os from "os-utils"

export default class Ram {
	public getUsage(callback: (percent: number) => any) {
		let freeRam = (os.freemem() / os.totalmem()) * 100
		callback(Math.round(freeRam))
	}
}