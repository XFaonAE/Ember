import { utils } from "../src/Main";

console.log(utils.parseConfig({
    prop: "Hello, world",
    groupYe: {
        lol: "yee",
        mm: "e"
    }
}, {
    prop: "new",
    groupYe: {
        
    }
}));