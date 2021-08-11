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

    public validateInput(inputData: string | object | string[], method: string | ((input: string | object | string[]) => number | object | string[]), options: any = {}): number {
        const config = this.parseConfig({
            modes: {
                email: (input: string): number => {
                    // REFERENCE ERROR CODES VALIDATE EMAIL
                    // ERROR: 0 | All set, no errors
                    // ERROR: 1 | No email provided
                    // ERROR: 2 | Invalid email address

                    if (!input || input.length == 0) {
                        return 1;
                    }

                    if (input.length < 3 || input.length > 345 || (!/(.*?)@(.*?)/.test(input))) {
                        return 2;
                    }

                    return 0;
                },
                password: (input: string[]): number => {
                    // REFERENCE ERROR CODES VALIDATE PASSWORD
                    // ERROR: 0 | All set, no errors
                    // ERROR: 1 | No password provided
                    // ERROR: 2 | Password is too short
                    // ERROR: 3 | Password is too long
                    // ERROR: 4 | Passwords do not match

                    if (!(input[0]?.length > 0)) {
                        return 1;
                    }

                    if (input[0].length < 8) {
                        return 2;
                    }

                    if (input[0]?.length > 100) {
                        return 3;
                    }

                    if (input[0] !== input[1]) {
                        return 4;
                    }

                    return 0;
                }
            }
        }, options);

        if (typeof method == "string") {
            try {
                return config.modes[method](inputData);
            } catch (error: any) {
                throw new Error(`Invalid method "${method}"`);
            }
        }

        return <any>method(inputData);
    }
}