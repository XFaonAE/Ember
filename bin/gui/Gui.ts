import { gui, terminal } from "../../src/Main";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import packageNode from "../../package.json";

export default class Gui {
    public dev(args: string[], flags: any) {
        if (fs.existsSync(path.join(process.cwd(), "./src/Main.ts"))) {
            if (fs.existsSync(path.join(process.cwd(), "./src/Main.js"))) {
                const devServer = gui.create({
                    dev: {
                        server: {
                            port: 1010
                        },
                        project: {
                            root: process.cwd()
                        }
                    }
                });

                devServer.run();
                return;
            }

            terminal.error("The entry script has not been compiled");
            return;
        }

        terminal.error("The entry script for this project does not exist");
    }

    public init(args: string[], flags: any) {
        terminal.log("Initialize a new GUI application");

        const projectResource = {
            package: {} as { [ index: string ]: any },
            templateProject: {
                package: JSON.parse(
                    fs.readFileSync(
                        path.join(__dirname, "../../src/gui/template/package.json"), 
                    "utf8")
                ) as { [ index: string ]: any },
                path: path.join(__dirname, "../../src/gui/template")
            }
        }

        terminal.stdin.readPage([
            {
                question: "Name",
                defaultAnswer: "unnamed"
            },
            {
                question: "Description"
            },
            {
                question: "Version",
                defaultAnswer: "0.0.1"
            },
            {
                question: "Keywords",
                defaultAnswer: "AxeriEmber"
            },
            {
                question: "Install Flux UI components",
                defaultAnswer: "yes"
            }
        ], (answers: any) => {
            projectResource.package.name = answers["Name"];
            projectResource.package.description = answers["Description"];
            projectResource.package.version = answers["Version"];
            projectResource.package.keywords = answers["Keywords"].split(" ");
            projectResource.package.dependencies = projectResource.templateProject.package.dependencies;
            projectResource.package.devDependencies = projectResource.templateProject.package.devDependencies;
            projectResource.package.main = projectResource.templateProject.package.main;
            projectResource.package.dependencies["@axeridev/ember"] = "^" + packageNode.version;

            if (answers["Install Flux UI components"].toLowerCase() == "yes") {
                projectResource.package.dependencies["@axeridev/flux-ui"] = "^0.0.1";
            }

            if (flags.copyTemplate !== false) {
                terminal.log("Copying template files");
                fs.copySync(projectResource.templateProject.path, process.cwd(), { overwrite: true });
            } else {
                terminal.warning("Skipping task for copying template files");
            }

            let mainFile = fs.readFileSync(path.join(process.cwd(), "./src/Main.ts"), "utf8");
            let vueFile = fs.readFileSync(path.join(process.cwd(), "./src/vue/Vue.ts"), "utf8");

            if (flags.writePackage !== false) {
                terminal.log("Writing project package");
                fs.writeFileSync(path.join(process.cwd(), "./package.json"), JSON.stringify(projectResource.package, null, 2));
            } else {
                terminal.warning("Skipping task for writing new package");
            }

            if (flags.updateGuiImport !== false) {
                terminal.log("Updating module import");
                mainFile = mainFile.replace(new RegExp("import { gui } from \"../../../Main\";", "g"), 
                    "import { gui } from \"@axeridev/ember\";");
            } else {
                terminal.warning("Skipping task for updating module import");
            }

            if (answers["Install Flux UI components"].toLowerCase() == "yes") {
                terminal.log("Installing FluxUI to VueJS");
                vueFile = vueFile.replace(new RegExp(/\/\* INJECT FLUX \*\//, "g"), `\napp.use(FluxUi.create());`);
                vueFile = vueFile.replace(new RegExp(/\/\* INJECT FLUX IMPORT \*\//, "g"), `\nimport FluxUi from "@axeridev/flux-ui/src/vue/Main";`);
            } else {
                terminal.warning("Skipping task for installing FluxUI to VueJS");
                vueFile = vueFile.replace(new RegExp(/\/\* INJECT FLUX \*\//, "g"), ``);
                vueFile = vueFile.replace(new RegExp(/\/\* INJECT FLUX IMPORT \*\//, "g"), ``);
            }

            terminal.log("Re-writing entry script");
            fs.writeFileSync(path.join(process.cwd(), "./src/Main.ts"), mainFile);

            terminal.log("Re-writing VueJS entry script");
            fs.writeFileSync(path.join(process.cwd(), "./src/vue/Vue.ts"), vueFile);

            const installPackages = (done: () => any) => {
                if (flags.install !== false) {
                    terminal.log("Installing packages");
                    const npmJs = exec("npm install");
                    const npmWrite = (data: string) => {
                        if (data.startsWith("\nup to date")) {
                            done();
                        }
                    }

                    npmJs.stderr?.on("data", (data: string) => npmWrite(data));
                    npmJs.stdout?.on("data", (data: string) => npmWrite(data));
                } else {
                    terminal.warning("Skipped task for installing packages");
                    done();
                }
            }

            const compileTs = (done: () => any) => {
                if (flags.compileTypeScript !== false) {
                    terminal.log("Compiling TypeScript");
                    const tsJs = exec("npx tsc");
                    let ready = false;

                    const writeTsJs = (data: string) => {
                        if (!ready) {
                            ready = true;
                            done();
                        }
                    }

                    tsJs.stdout?.on("data", (data: string) => writeTsJs(data))
                    tsJs.stderr?.on("data", (data: string) => writeTsJs(data))
                } else {
                    terminal.warning("Skipping TypeScript compiler");
                    done();
                }
            }

            installPackages(() => {
                compileTs(() => {
                    terminal.success("Project initialization finished");
                    terminal.row("ember gui dev", "Start the application for development");
                    terminal.row("ember gui build [ Coming Soon ]", "Build the application for production");
                });
            });
        });
    }
}