export const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Project name:",
    default: "my-express-app",
    validate: (input) => {
      if (!input.trim()) return "Project name cannot be empty";
      if (!/^[a-z0-9-_]+$/i.test(input.trim())) {
        return "Project name can only contain letters, numbers, hyphens and underscores";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "language",
    message: "Language:",
    choices: ["TypeScript", "JavaScript"],
    default: "TypeScript",
  },
  {
    type: "list",
    name: "database",
    message: "Database:",
    choices: ["MongoDB", "MySQL", "PostgreSQL"],
    default: "MongoDB",
  },
  {
    type: "confirm",
    name: "includeTests",
    message: "Include Jest test setup?",
    default: true,
  },
  {
    type: "list",
    name: "authMode",
    message: "Authorization model:",
    choices: [
      { name: "Single role (user)", value: "single" },
      { name: "Multi role (superadmin/admin/user)", value: "multi" },
    ],
    default: "multi",
  },
];
