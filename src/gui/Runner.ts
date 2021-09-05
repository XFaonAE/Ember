import { ChildProcess, exec, spawn } from "child_process"
import path from "path"
import { terminal } from "../Main"
import { AppOptions } from "./Gui"
import chokidar from "chokidar"

export default class Runner {
	/**
	 * 
	 * @param config Dev server config
	 * @param callback Finished callback
	 * @returns void
	 */
	public async runVue(config: AppOptions, callback: (host: string) => void) {
		if (config.vue?.skip) {
			terminal.warning("Skipping VueJS development server")
			callback("")
			return
		}

		terminal.animate({
            message: "Starting VueJS development service",
            store: true
        });

		const service = exec("npx vue-cli-service serve " + (config.dev?.server?.port ? "--port=" + config.dev.server.port : ""), {
			cwd: config.dev?.project?.root
		});

		let ready = false

		const write = (data: string) => {
			if (!ready && /Local:\s{3}http:\/\/(.*?)\/ /.exec(data)) {
				ready = true
				
				const matchData = /Local:\s{3}http:\/\/(.*?)\/ /.exec(data)
				const devLocation = matchData ? matchData[1] : "localhost"

				terminal.getAnimation()?.stop("VueJS development service is ready", "success");
				callback(devLocation)
			}  
		}

		service.stdout?.on("data", (data: string) => write(data))
		service.stderr?.on("data", (data: string) => write(data))
	}

	/**
	 * 
	 * @param config Dev server config
	 * @param host ElectronJS dev server host
	 * @param callback Finished callback
	 * @returns void
	 */
	public async runElectron(config: AppOptions, host: string, callback: () => void) {
		if (config.electron?.skip) {
			terminal.warning("Skipping ElectronJS development app")
			callback()
			return
		}

		terminal.animate({
            message: "Starting ElectronJS development service",
            store: true
        });

		let ready = false
		const electronMeta = exec("node " + path.join(config.dev?.project?.root ?? "", "./src/electron/GetExe.js"))

		electronMeta.stdout?.on("data", (data: string) => {
			const electronExe = data.replace(new RegExp(/\n/, "g"), "")
			let service: null | ChildProcess = null
			let restarting = false

			const restart = () => {
				service?.kill()
				start()
			}

			const watchRestart = () => {
				const electronDir = chokidar.watch(path.join(config.dev!.project!.root!, "./src/electron/"))

				let wait: NodeJS.Timer
				let initTrue = false

				const queue = () => {
					if (!initTrue) {
						initTrue = true
						wait = setTimeout(() => {
							restart()
						}, config.electron?.saveRestartTime)
						
						wait?.refresh()
						return
					}

					wait?.refresh()
				}

				electronDir.on("change", () => queue())
			}

			const write = (data: string) => {
				if (config.electron?.log) {
					process.stdout.write(data)
				}

				switch (data) {
					case "dev-host-ready":
						if (!ready) {
							ready = true
							watchRestart()

							terminal.getAnimation()?.stop("ElectronJS development service is ready", "success");
							callback()
						}
						break

					case "dev-host-failed":
						if (!ready) {
							ready = true
							terminal.getAnimation()?.stop("Failed to start ElectronJS development service", "error");

							watchRestart()
							callback()
						}
						break

					case "app-closed":
						if (!restarting) {
							terminal.log("ElectronJS was closed, stopping development server")
							process.exit(0)
						}
				}
			}

			const start = () => {
				service = spawn(electronExe, [ path.join(config.dev?.project?.root!, "./src/electron/Electron.js"), "http://" + host ], {
					cwd: config.dev?.project?.root
				})

				service.stdout?.on("data", (data: any) => write(data.toString()))
				service.stderr?.on("data", (data: any) => write(data.toString()))
			}

			start()
		})
	}
}