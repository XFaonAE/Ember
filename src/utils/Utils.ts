export default class Utils {
    public parseConfig(defaultOptions: any, replacerConfig: any): any {
        const parse = (defaults: any, replacer: any) => {
            for (const defaultProp in defaults) {
                if (typeof defaults[defaultProp] == "object") {
                    parse(defaults[defaultProp], replacer[defaultProp]);
                } else {
                    if (replacer[defaultProp]) {
                        defaults[defaultProp] = replacer[defaultProp]
                    } 
                }
            }
        }

        parse(defaultOptions, replacerConfig);
        return defaultOptions;
    }
}