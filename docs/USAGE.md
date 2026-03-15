# Usage

Basic usage

```bash
npx create-express-init my-app
```

Interactive options
- Language: TypeScript or JavaScript.
- Database: MongoDB, MySQL, or PostgreSQL.
- Tests: include Jest setup or skip it.
- Install dependencies: choose whether to run npm install automatically.

What gets generated
- Base Express app template (JS or TS).
- Database addon for your selection.
- Optional Jest setup.

After scaffolding

```bash
cd my-app
cp .env.example .env
# Fill in your .env values
npm run dev
```

For SQL databases

```bash
npx prisma db push
# or use migrations
npx prisma migrate dev --name init
```
