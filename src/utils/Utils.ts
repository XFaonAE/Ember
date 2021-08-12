import bcrypt from "bcrypt";

export interface EncryptPasswordOptions {
    salt?: {
        cycles?: number;
    };
}

export enum PasswordErrors {
    missingPassword,
    tooShort,
    tooLong,
    passwordsNoMatch
}

export enum EmailErrors {
    missingEmail,
    invalid
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
                    if (typeof input != "string") {
                        return -1;
                    }

                    if (!input || input.length == 0) {
                        return EmailErrors.missingEmail;
                    }

                    if (input.length < 3 || input.length > 345 || (!/(.*?)@(.*?)/.test(input))) {
                        return EmailErrors.invalid;
                    }

                    return -2;
                },
                password: (input: string[]): number => {
                    if (input[0] == undefined || input[1] == undefined) {
                        return -1;
                    }

                    if (!(input[0]?.length > 0)) {
                        return PasswordErrors.missingPassword;
                    }

                    if (input[0].length < 8) {
                        return PasswordErrors.tooShort;
                    }

                    if (input[0]?.length > 100) {
                        return PasswordErrors.tooLong;
                    }

                    if (input[0] !== input[1]) {
                        return PasswordErrors.passwordsNoMatch;
                    }

                    return -2;
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