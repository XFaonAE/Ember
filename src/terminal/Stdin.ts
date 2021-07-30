import * as readline from "readline";
import chalk from "chalk";

export default class Stdin {
    public read(question: string, defaultAnswer: string|null = null, callback: (answer: string) => any) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        let suffix = ""
        if (defaultAnswer) {
            suffix = " [ " + defaultAnswer + " ]"
        }

        rl.question(chalk.rgb(116, 189, 221)(">  ") + question + chalk.hex("#777")(suffix) + ":  ", (answer: string) => {
            rl.close()

            if (answer.length == 0) {
                callback(typeof defaultAnswer !== "string" ? "" : defaultAnswer)
                return
            }

            callback(answer)
        })
    }
}