# Usage

Basic usage

```bash
npx create-express-init my-app
```

Interactive options
- Language: TypeScript or JavaScript.
- Database: MongoDB, MySQL, or PostgreSQL.
- Tests: include Jest setup or skip it.
- Auth structure: single-role or multi-role.

Dependencies are installed automatically after scaffolding.

Auth structure behavior
- Single-role: removes role from the user schema/model and auth token payload.
- Multi-role: keeps role-based structure (`superadmin`, `admin`, `user`).

What gets generated
- Base Express app template (JS or TS).
- Database addon for your selection.
- Optional Jest setup.

SQL selections (MySQL/PostgreSQL)
- Prisma schema and repository setup are generated.

After scaffolding

```bash
cd my-app
cp .env.example .env
npm run dev
```

For SQL databases

```bash
npx prisma db push
# or use migrations
npx prisma migrate dev --name init
```
