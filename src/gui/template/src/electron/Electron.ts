import { app, BrowserWindow } from "electron";
import path from "path";
import electronIsDev from "electron-is-dev";

app.on("ready", () => {
    const window = new BrowserWindow({
        width: 1500,
        height: 800,
        backgroundColor: "#f1f1f1",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });

    window.on("close", () => {
        process.stdout.write("app-closed");
    });

    if (electronIsDev) {
        const args = process.argv.splice(2);
        const devServerLocation = args[0];

        window.loadURL(devServerLocation).then(() => {
            process.stdout.write("dev-host-ready");
        }).catch((reason: any) => {
            process.stdout.write("dev-host-failed");
            console.log(reason);
        });
    } else {
        window.loadFile(path.join(__dirname, "../../dist/vue/")).then(() => {});
    }
});