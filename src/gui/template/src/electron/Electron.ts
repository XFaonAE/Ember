import { app, BrowserWindow } from "electron";
import path from "path";
import electronIsDev from "electron-is-dev";

app.on("ready", () => {
    const window = new BrowserWindow();

    if (electronIsDev) {
        const args = process.argv.splice(2);
        const devServerPort = args[0] ? ":" + args[0] : "";

        window.loadURL("http://localhost" + devServerPort).then(() => {});
    } else {
        window.loadFile(path.join(__dirname, "../../dist/vue/")).then(() => {});
    }
});