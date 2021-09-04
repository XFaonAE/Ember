import { terminal } from "../src/Main";

const ani = terminal.animate({
    message: "Hello :o"
});

setTimeout(() => {
    ani.stop();

    const ani2 = terminal.animate({
        message: "Hello :o"
    });
    
    setTimeout(() => {
        ani2.stop();
    }, 1000);
}, 1000);