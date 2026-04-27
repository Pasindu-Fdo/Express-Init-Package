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
	const withUiDefaults = { ...question, prefix: chalk.cyan("›") };

	if (question.name === "projectName" && argvProjectName) {
		return { ...withUiDefaults, default: argvProjectName, when: false };
	}

	return withUiDefaults;
});

const answers = await inquirer.prompt(promptQuestions);
if (argvProjectName) {
	answers.projectName = argvProjectName;
}

await scaffold(answers);
