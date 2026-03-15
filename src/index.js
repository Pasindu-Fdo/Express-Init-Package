import inquirer from "inquirer";
import chalk from "chalk";
import { questions } from "./prompts/questions.js";
import { scaffold } from "./utils/scaffold.js";

console.log(chalk.bold.cyan("\n  create-express-auth\n"));

const answers = await inquirer.prompt(questions);
await scaffold(answers);
