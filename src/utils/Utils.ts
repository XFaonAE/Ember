import bcrypt from "bcrypt";

export interface EncryptPasswordOptions {
    salt?: {
        cycles?: number;
    };
}

export default class Utils {
    public parseConfig(defaultOptions: any, replacerConfig: any): any {
        const parse = (defaults: any, replacer: any) => {
            for (const defaultProp in defaults) {
                if (typeof defaults[defaultProp] == "object" && defaults[defaultProp] != null && !Array.isArray(defaults[defaultProp])) {
                    parse(defaults[defaultProp], replacer[defaultProp]);
                } else {
                    if (replacer !== undefined && replacer.hasOwnProperty(defaultProp)) {
                        defaults[defaultProp] = replacer[defaultProp];
                    } 
                }
            }
        }

        parse(defaultOptions, replacerConfig);
        return defaultOptions;
    }

    public encryptPassword(password: string, callback: (hash: string) => any, options: EncryptPasswordOptions = {}) {
        const config = this.parseConfig({
            salt: {
                cycles: 10
            }
        } as EncryptPasswordOptions, options);

        bcrypt.genSalt(config.salt.cycles, (error: any, salt: string) => {
            bcrypt.hash(password, salt, (error: any, hash: string) => {
                callback(hash);
            });
        });
    }

    public validatePassword(password: string, hash: string, callback: (valid: boolean) => any) {
        bcrypt.compare(password, hash, (error: any, success: boolean) => {
            callback(success);
        });
    }
}