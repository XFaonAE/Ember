import { terminal, utils } from "../Main";

export interface AnimationOptions {
	state?: "error" | "warning" | "success" | "info";
	interval?: number;
	message: string;
	frames?: string[];
}

export default class Animation {
    public config: AnimationOptions;
    public meta = {
        loop: setInterval(() => {}, 100),
        frame: 0,
        running: false
    };

    public constructor(options: AnimationOptions) {
        this.config = utils.parseConfig({
            state: "info",
            interval: 100,
            message: "",
            frames: [
                "-",
                "\\",
                "|",
                "/"
            ]
        } as AnimationOptions, options);

        this.meta.running = true;
        this.start();
    }

    private async start() {
        this.meta.frame = 0;

        this.meta.loop = setInterval(() => {
            this.renderAnimatingCurrent();

            this.meta.frame++;
            if (this.meta.frame > this.config.frames!.length - 1) {
                this.meta.frame = 0;
            }
        }, this.config.interval);
    }

    public async stop() {
        this.meta.running = false;
        clearInterval(this.meta.loop);

        process.stdout.write(`\r${this.getFrame()} \n`);
    }

    private getFrame(frame: number = 0): string {
        const stateColor = terminal.charset.stateColors[this.config.state!];
        let loaderIcon = "";

        if (this.meta.running) {
            loaderIcon = terminal.hex(stateColor, this.config.frames![frame]);
        } else {
            loaderIcon = terminal.hex(stateColor, terminal.charset.logIcon);
        }

        return `${loaderIcon}  ${this.config.message}`;
    }

    private renderAnimatingCurrent() {
        const frame = this.getFrame(this.meta.frame);
        process.stdout.write("\r" + frame);
    }
}