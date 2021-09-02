import { terminal } from "../src/Main";

terminal.animate("Hello", {
    state: "info"
});

setTimeout(() => {
    terminal.endAnimation("New", "error");

    terminal.animate("Hello", {
        state: "info"
    });
}, 1000);