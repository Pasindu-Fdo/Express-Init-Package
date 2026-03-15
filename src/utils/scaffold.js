import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..", "..");

const DB_ADDON_MAP = {
  MongoDB: "mongoose",
  MySQL: "mysql",
  PostgreSQL: "postgres",
};

/**
 * Deep-merges `addon` package.json fields (dependencies, devDependencies, scripts)
 * into `base` without mutating either argument.
 */
function mergePackageJson(base, addon) {
  const result = { ...base };
  if (addon.dependencies) {
    result.dependencies = { ...base.dependencies, ...addon.dependencies };
  }
  if (addon.devDependencies) {
    result.devDependencies = { ...base.devDependencies, ...addon.devDependencies };
  }
  if (addon.scripts) {
    result.scripts = { ...base.scripts, ...addon.scripts };
  }
  return result;
}

/**
 * Copies files from `src` to `dest`, skipping package.json and .env.example
 * so those can be merged separately.
 */
async function copySourceFiles(src, dest) {
  await fs.copy(src, dest, {
    overwrite: true,
    filter: (srcPath) => {
      const base = path.basename(srcPath);
      if (base === "package.json" || base === ".env.example") return false;
      // Skip type stubs in addons — base template provides these
      const rel = path.relative(src, srcPath).replace(/\\/g, "/");
      if (rel === "src/types" || rel.startsWith("src/types/")) return false;
      return true;
    },
  });
}

export async function scaffold({ projectName, language, database, includeTests }) {
  const lang = language === "TypeScript" ? "ts" : "js";
  const dbKey = DB_ADDON_MAP[database];

  const destDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(destDir)) {
    console.error(chalk.red(`\nError: Directory "${projectName}" already exists.\n`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\nScaffolding ${chalk.bold(projectName)}...\n`));

  // ── 1. Copy base template ──────────────────────────────────────────────────
  const baseDir = path.join(ROOT_DIR, "templates", `base-${lang}`);
  await fs.copy(baseDir, destDir, { overwrite: true });

  // ── 2. Copy DB addon source files (overwrite base DB stubs) ───────────────
  const dbAddonDir = path.join(ROOT_DIR, "addons", `db-${dbKey}-${lang}`);
  await copySourceFiles(dbAddonDir, destDir);

  // ── 3. Merge package.json: base + DB addon ─────────────────────────────────
  let mergedPkg = await fs.readJson(path.join(baseDir, "package.json"));
  const dbPkg = await fs.readJson(path.join(dbAddonDir, "package.json"));
  mergedPkg = mergePackageJson(mergedPkg, dbPkg);

  // ── 4. Build .env.example: base + DB addon ─────────────────────────────────
  const baseEnv = await fs.readFile(path.join(baseDir, ".env.example"), "utf-8");
  const dbEnv = await fs.readFile(path.join(dbAddonDir, ".env.example"), "utf-8");
  let finalEnv = baseEnv.trimEnd() + "\n\n# Database\n" + dbEnv.trimEnd() + "\n";

  // ── 5. Optionally add Jest addon ───────────────────────────────────────────
  if (includeTests) {
    const jestAddonDir = path.join(ROOT_DIR, "addons", `jest-${lang}`);
    await copySourceFiles(jestAddonDir, destDir);

    const jestPkg = await fs.readJson(path.join(jestAddonDir, "package.json"));
    mergedPkg = mergePackageJson(mergedPkg, jestPkg);
  }

  // ── 6. Write merged package.json ───────────────────────────────────────────
  mergedPkg.name = projectName;
  await fs.writeJson(path.join(destDir, "package.json"), mergedPkg, { spaces: 2 });

  // ── 7. Write final .env.example ────────────────────────────────────────────
  await fs.writeFile(path.join(destDir, ".env.example"), finalEnv);

  // ── 8. Print next steps ────────────────────────────────────────────────────
  console.log(chalk.green(`✔ Project "${chalk.bold(projectName)}" created successfully!\n`));
  console.log(chalk.white("Next steps:"));
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan(`  npm install`));
  console.log(chalk.cyan(`  cp .env.example .env`));
  console.log(chalk.cyan(`  # Fill in your .env values`));
  if (database !== "MongoDB") {
    console.log(chalk.cyan(`  npx prisma db push`));
    console.log(chalk.dim(`  # or use migrations: npx prisma migrate dev --name init`));
  }
  console.log(chalk.cyan(`  npm run dev\n`));
}
