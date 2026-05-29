import { config } from "dotenv";
import { resolve } from "node:path";
import { hashSecret } from "@lyrus/auth";
import { UserRole, prisma } from "./index.js";

config({ path: resolve(process.cwd(), "../../.env") });
config({ path: resolve(process.cwd(), ".env") });

type SeedUser = {
  email: string;
  name: string;
  password: string;
  role: (typeof UserRole)[keyof typeof UserRole];
};

async function upsertUser(user: SeedUser) {
  const email = user.email.toLowerCase();
  const passwordHash = await hashSecret(user.password);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: user.name,
      passwordHash,
      role: user.role,
    },
    update: {
      name: user.name,
      passwordHash,
      role: user.role,
    },
  });

  console.info(`Seeded user: ${email}`);
}

async function main() {
  const users: SeedUser[] = [
    {
      email: (process.env.SEED_ADMIN_EMAIL ?? "admin@lyrus.life").toLowerCase(),
      name: process.env.SEED_ADMIN_NAME ?? "Admin User",
      password: process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!",
      role: UserRole.ADMIN,
    },
    {
      email: (process.env.SEED_KRISHAN_EMAIL ?? "krishan.kumar@virtualedge.in").toLowerCase(),
      name: process.env.SEED_KRISHAN_NAME ?? "Krishan Kumar Safi",
      password: process.env.SEED_KRISHAN_PASSWORD ?? "LyrusVirt@2026",
      role: UserRole.ADMIN,
    },
  ];

  for (const user of users) {
    await upsertUser(user);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
