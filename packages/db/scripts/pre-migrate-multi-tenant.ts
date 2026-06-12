/**
 * Prepares the database for multi-tenant schema push by converting
 * legacy UserRole enum values (USER, ADMIN) before Prisma replaces the enum.
 *
 * Run: pnpm --filter @lyrus/db db:pre-migrate
 * Then: pnpm db:push:force && pnpm db:seed
 */
import pg from "pg";
import "../src/load-env.js";
import { pgConnectionConfig } from "../src/pg-config.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = new pg.Client(pgConnectionConfig(connectionString));

async function columnExists(table: string, column: string): Promise<boolean> {
  const res = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_name = $1 AND column_name = $2`,
    [table, column],
  );
  return res.rowCount !== null && res.rowCount > 0;
}

async function tableExists(table: string): Promise<boolean> {
  const res = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
    [table],
  );
  return res.rowCount !== null && res.rowCount > 0;
}

async function main() {
  await client.connect();

  const hasUser = await tableExists("User");
  if (!hasUser) {
    console.info("No User table yet — skip pre-migrate.");
    return;
  }

  const hasLegacyRole = await client.query(`
    SELECT enumlabel FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'UserRole' AND enumlabel IN ('ADMIN', 'USER')
  `);

  if (hasLegacyRole.rowCount === 0) {
    console.info("UserRole already migrated — skip pre-migrate.");
    return;
  }

  console.info("Migrating legacy UserRole values…");

  await client.query(`ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT`);
  await client.query(`ALTER TABLE "User" ALTER COLUMN role TYPE text USING role::text`);
  await client.query(`UPDATE "User" SET role = 'SUPER_ADMIN' WHERE role = 'ADMIN'`);
  await client.query(`UPDATE "User" SET role = 'EMPLOYEE' WHERE role = 'USER'`);
  await client.query(`DROP TYPE IF EXISTS "UserRole"`);

  if (!(await columnExists("User", "firstName"))) {
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "firstName" text NOT NULL DEFAULT ''`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastName" text NOT NULL DEFAULT ''`);
    await client.query(`
      UPDATE "User"
      SET "firstName" = COALESCE(NULLIF(split_part(name, ' ', 1), ''), 'User'),
          "lastName" = COALESCE(NULLIF(trim(substring(name from position(' ' in name))), ''), split_part(name, ' ', 1), 'User')
      WHERE "firstName" = '' OR "lastName" = ''
    `);
  }

  console.info("Pre-migrate complete. Run: pnpm db:push:force && pnpm db:seed");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
