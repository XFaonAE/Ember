import { createApp } from "vue";
import Main from "./Main.vue";
import router from "./plugins/Router";
import FluxUi from "@axeridev/flux-ui";

const app = createApp(Main);

app.use(router);
app.use(FluxUi.create());
app.mount("#app");
