import { hashSecret } from "@lyrus/auth";
import "./load-env.js";
import { UserRole, UserStatus, prisma } from "./index.js";

function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

type SuperAdminSeed = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

function loadSuperAdmins(): SuperAdminSeed[] {
  const admins: SuperAdminSeed[] = [];

  for (let index = 1; index <= 10; index += 1) {
    const email = process.env[`SEED_SUPER_ADMIN_${index}_EMAIL`]?.trim();
    if (!email) break;

    admins.push({
      email: email.toLowerCase(),
      firstName: process.env[`SEED_SUPER_ADMIN_${index}_FIRST_NAME`]?.trim() ?? "Super",
      lastName: process.env[`SEED_SUPER_ADMIN_${index}_LAST_NAME`]?.trim() ?? "Admin",
      password:
        process.env[`SEED_SUPER_ADMIN_${index}_PASSWORD`]?.trim() ??
        process.env.SEED_SUPER_ADMIN_PASSWORD?.trim() ??
        "ChangeMe123!",
    });
  }

  return admins;
}

async function upsertSuperAdmin(input: SuperAdminSeed) {
  const email = input.email.toLowerCase();
  const passwordHash = await hashSecret(input.password);
  const name = fullName(input.firstName, input.lastName);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      name,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: null,
    },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      name,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: null,
    },
  });

  console.info(`Seeded super admin: ${email}`);
}

async function seedPlatformPricing() {
  await prisma.platformPricingConfig.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      starterMonthlyInr: 999,
      starterYearlyInr: 9_999,
      growthMonthlyInr: 2_999,
      growthYearlyInr: 29_999,
      enterpriseBaseMonthlyInr: 9_999,
      extraUserMonthlyInr: 99,
      extraLocationMonthlyInr: 499,
      gstPercent: 18,
      freeTrialDays: 14,
    },
    update: {},
  });
  console.info("Seeded platform pricing config (defaults)");
}

async function main() {
  const superAdmins = loadSuperAdmins();
  if (superAdmins.length === 0) {
    throw new Error("No super admins configured. Set SEED_SUPER_ADMIN_1_EMAIL in .env");
  }

  for (const admin of superAdmins) {
    await upsertSuperAdmin(admin);
  }

  await seedPlatformPricing();
  console.info(`Seed complete: ${superAdmins.length} super admin(s) + platform pricing`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
