import { createApp } from "vue";
import App from "./App.vue";
import Router from "./plugins/Router";

if (!process) {
    alert("App must be running inside of an ElectronJS environment with node integrations enabled");
} else {
    const app = createApp(App);

    app.use(Router);
    app.mount("#app");
}
