import { command } from "../../src/Main";

export default class Gui {
    public constructor() {
        command.on("run", () => {

        }, { triggers: [ "gui" ] })
    }
}