import { terminal } from "../src/Main";

terminal.animate("Hello", {
    state: "info"
});

setTimeout(() => {
    terminal.endAnimation("New", "error");
}, 1500);