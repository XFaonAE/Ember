import { terminal } from "../src/Main";

const ani = terminal.animate({
    message: "Hello :o",
    store: true
});

setTimeout(() => {
    terminal.getAnimation()?.stop();

    const ani2 = terminal.animate({
        message: "Hello :o",
        store: true
    });
    
    setTimeout(() => {
        terminal.getAnimation()?.stop();
    }, 1000);
}, 1000);