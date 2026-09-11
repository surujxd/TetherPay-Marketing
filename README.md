# TetherPay Marketing

Next.js marketing site and API routes for TetherPay.

## Local development

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm dev
```

The site runs at `http://localhost:3000`.

## Production hosting

This project builds a standalone Next.js server and requires Node.js 20.9 or newer.

1. Set `DATABASE_URL` in the hosting provider's environment settings. For SQLite, use a persistent volume and a value such as `file:/data/tetherpay.db`. A managed database is recommended for multi-instance deployments.
2. Install dependencies with `pnpm install --frozen-lockfile`.
3. Build with `pnpm build`.
4. Start with `pnpm start`.

The `postinstall` script generates Prisma Client automatically. Run `pnpm db:push` as a one-time database initialization step when using SQLite.

Never commit `.env` or a production database file. Use `.env.example` as the configuration template.
