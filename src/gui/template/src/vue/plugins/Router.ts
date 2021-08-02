import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        }
    ]
});