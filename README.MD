# create-express-init

Scaffold a production-ready Express.js authentication starter for JavaScript and TypeScript with sensible defaults and optional database/test integrations.

[![npm version](https://img.shields.io/npm/v/create-express-init.svg)](https://www.npmjs.com/package/create-express-init)
[![Node.js](https://img.shields.io/node/v/create-express-init)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Why create-express-init

- Generate a clean Express project in minutes
- Choose JavaScript or TypeScript
- Add MongoDB, MySQL, or PostgreSQL setup
- Optionally include Jest test scaffolding
- Get an authentication-ready structure designed for scaling

## Quick Start

```bash
npx create-express-init my-app
```

Then:

```bash
cd my-app
cp .env.example .env
npm run dev
```

## Requirements

- Node.js 20 or newer
- npm (or any compatible package manager)

## Interactive Options

When you run the command, you can choose:

- Language: `js` or `ts`
- Database: `mongo`, `mysql`, or `postgres`
- Tests: `jest` or none
- Auth structure: single-role or multi-role

Dependencies are installed automatically after scaffolding.

## Auth Model Options

- Single-role: removes role from the user schema/model and auth token payload.
- Multi-role: keeps role-based structure (`superadmin`, `admin`, `user`).

## SQL Notes (MySQL/PostgreSQL)

- The generated project does not include `src/models` for SQL selections.
- Prisma schema and repositories are generated for DB access.

## SQL Database Setup (MySQL/PostgreSQL)

If you selected a SQL addon, run one of the following after updating `.env`:

```bash
npx prisma db push
```

or

```bash
npx prisma migrate dev --name init
```

## What Gets Generated

- Base Express app template (JS or TS)
- Authentication flow scaffolding (controller/service/repository-friendly layout)
- Selected database integration addon
- Optional Jest setup

## Documentation

- Usage guide: [docs/USAGE.md](docs/USAGE.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## License

MIT License. See [LICENSE](LICENSE).
