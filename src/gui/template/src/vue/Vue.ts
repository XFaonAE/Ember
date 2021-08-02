import { createApp } from "vue";
import Main from "./Main.vue";
import Router from "./plugins/Router";

const app = createApp(Main);

app.use(Router);

app.mount("#app");
