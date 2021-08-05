export default class Macros {
    public list: { [ index: string ]: (...args: any[]) => any } = {};

    public add(name: string, exec: (...args: any[]) => any) {
        this.list[name] = exec;
    }

    public run(name: string, ...args: any[]) {
        try {
            this.list[name](...args);
        } catch (error: any) {
            console.error("Invalid macro");
        }
    }
}