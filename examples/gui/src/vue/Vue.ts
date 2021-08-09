import { App, createApp } from "vue";
import Main from "./Main.vue";
import router from "./plugins/Router";
import TitleBar from "./vendor/axeridev/flux/TitleBar.vue";

class Vue {
    public app?: App;

    public install(vueApp: App) {
        this.app = vueApp;

        this.defineElectron();

        vueApp.component("TitleBar", TitleBar);
    }

    public defineElectron() {
        const vueApp = this.app;

        if (vueApp) {
            vueApp.config.globalProperties.$electron = window.require("electron");
            vueApp.config.globalProperties.$remote = window.require("@electron/remote");
        }
    }
}

const app = createApp(Main);

app.use(router);
app.use(new Vue());
app.mount("#app");
