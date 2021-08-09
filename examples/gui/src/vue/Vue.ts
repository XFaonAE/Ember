import { createApp } from "vue";
import Main from "./Main.vue";
import router from "./plugins/Router";
import FluxUi from "axeri-flux-ui/src/vue/Main";

const app = createApp(Main);

app.use(router);
app.use(FluxUi.create());
app.mount("#app");
