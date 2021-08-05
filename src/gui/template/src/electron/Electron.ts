import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import electronIsDev from "electron-is-dev";

app.on("ready", () => {
    const appWindow = new BrowserWindow({
        width: 1500,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });

    ipcMain.on("electron:close", () => {
        process.stdout.write("app-closed");
        app.exit();
    });

    ipcMain.on("electron:size", () => {
        if (appWindow.isMaximized()) {
            appWindow.restore();
            return;
        }

        appWindow.maximize();
    });

    ipcMain.on("electron:minimize", () => {
        appWindow.minimize();
    });

    appWindow.on("close", () => {
        process.stdout.write("app-closed");
    });

    ipcMain.on("electron:isMaximized", () => {
        appWindow.webContents.send("electron:isMaximized", appWindow.isMaximized());
    });

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