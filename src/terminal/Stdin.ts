import * as readline from "readline";
import chalk from "chalk";

export interface Question {
    question: string;
    defaultAnswer?: string;
}
export default class Stdin {
    public read(question: string, defaultAnswer: string | null | undefined = null, callback: (answer: string) => any) {
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

    public readPage(questions: Question[], callback: (answers: { [ index: string ]: any }) => any) {
        let quesIndex = 0;
        let result: any = {};
        const quesCount = questions.length;

        const iterate = () => {
            const question = questions[quesIndex];

            this.read(question.question, question.defaultAnswer, (answer: any) => {
                result[question.question] = answer;

                quesIndex++;
                if (quesIndex !== quesCount) {
                    iterate();
                    return;
                }

                callback(result);
            });
        }

        iterate();
    }
}