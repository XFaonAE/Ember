import { terminal, utils } from "../Main";

export interface AnimationOptions {
	state?: "error" | "warning" | "success" | "info";
	interval?: number;
	message: string;
	frames?: string[];
    store?: string | false;
}

export default class Animation {
    public config: AnimationOptions;
    private terminalStore: { [ index: string ]: Animation } = {};
    public meta = {
        loop: null as NodeJS.Timer | null,
        frame: 0,
        running: false
    };

    public constructor(options: AnimationOptions, terminalStore: { [ index: string ]: Animation }) {
        this.config = utils.parseConfig({
            state: "info",
            interval: 100,
            message: "",
            frames: [
                "-",
                "\\",
                "|",
                "/"
            ],
            store: false
        } as AnimationOptions, options);

        if (this.config.store) {
            this.terminalStore = terminalStore;
        }

        this.meta.running = true;
        this.start();
    }

    private async start() {
        this.meta.frame = 0;
        if (this.config.store) {
            this.terminalStore[this.config.store] = this;
        }

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
        clearInterval(this.meta.loop!);

        this.meta.loop = null;
        process.stdout.write(`\r${this.getFrame()} \n`);

        if (this.config.store) {
            delete this.terminalStore[this.config.store];
        }
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