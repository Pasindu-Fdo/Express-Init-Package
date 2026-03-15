import inquirer from "inquirer";
import chalk from "chalk";
import { questions } from "./prompts/questions.js";
import { scaffold } from "./utils/scaffold.js";

console.log(chalk.bold.cyan("\n  create-express-init\n"));

const argvProjectName = process.argv[2]?.trim();
const projectQuestion = questions.find((q) => q.name === "projectName");

if (argvProjectName && projectQuestion?.validate) {
	const validation = projectQuestion.validate(argvProjectName);
	if (validation !== true) {
		console.error(chalk.red(`\nError: ${validation}`));
		process.exit(1);
	}
}

const promptQuestions = questions.map((question) => {
	if (question.name === "projectName" && argvProjectName) {
		return { ...question, default: argvProjectName, when: false };
	}
	return question;
});

const answers = await inquirer.prompt(promptQuestions);
if (argvProjectName) {
	answers.projectName = argvProjectName;
}

await scaffold(answers);
