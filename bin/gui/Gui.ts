import { terminal } from "../../src/Main";
import fs from "fs-extra";
import path from "path";

export default class Gui {
    public dev(args: string[], flags: any) {
        terminal.log("The dev server has not yet been implemented into this current build, please try again later after updating");
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

            if (flags.copyTemplate !== false) {
                terminal.log("Copying template files");
                fs.copySync(projectResource.templateProject.path, process.cwd(), { overwrite: true });
            } else {
                terminal.warning("Skipping task for copying template files");
            }

            if (flags.writePackage !== false) {
                terminal.log("Writing project package");
                fs.writeFileSync(path.join(process.cwd(), "./package.json"), JSON.stringify(projectResource.package, null, 2));
            } else {
                terminal.warning("Skipping task for writing new package");
            }

            terminal.success("Project initialization finished");
            terminal.row("ember gui dev", "Start the application for development");
            terminal.row("ember gui build [ Coming Soon ]", "Build the application for production");
        });
    }
}