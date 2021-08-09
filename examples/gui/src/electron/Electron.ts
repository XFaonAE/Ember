import { app, BrowserWindow } from "electron";
import path from "path";
import electronIsDev from "electron-is-dev";

app.on("ready", () => {
    const appWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        frame: false,
        show: false,
        backgroundColor: "#121212",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, 
            webviewTag: true,
            enableRemoteModule: true
        }
    });
 
    appWindow.once("ready-to-show", () => appWindow.show());
    require("@electron/remote/main").initialize();

    if (electronIsDev) {
        const args = process.argv.splice(2);
        const devServerLocation = args[0];

        appWindow.loadURL(devServerLocation).then(() => {
            process.stdout.write("dev-host-ready");
        }).catch((reason: any) => {
            process.stdout.write("dev-host-failed");
            console.log(reason);
        });
    } else {
        appWindow.loadFile(path.join(__dirname, "../../dist/vue/")).then(() => {});
    }
});