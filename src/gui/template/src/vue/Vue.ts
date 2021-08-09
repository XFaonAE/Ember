import { createApp } from "vue";
import Main from "./Main.vue";
import router from "./plugins/Router";/* INJECT FLUX IMPORT */

const app = createApp(Main);

app.use(router);/* INJECT FLUX */
app.mount("#app");
