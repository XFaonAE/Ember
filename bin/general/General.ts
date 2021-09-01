import { appDevServer } from "../../src/Main";

export default class General {
    public dev(args: any[], flags: any) {
        const devServer = appDevServer.create();

        devServer.run();
    }
}