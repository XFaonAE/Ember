import { terminal } from "../src/Main";

terminal.animate("Hello", {
    state: "info"
});

setTimeout(() => {
    terminal.endAnimation(null, "error");
}, 1500);