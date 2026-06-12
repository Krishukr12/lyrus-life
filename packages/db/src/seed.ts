import { hashSecret } from "@lyrus/auth";
import "./load-env.js";
import { UserRole, UserStatus, prisma } from "./index.js";

function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

async function upsertSuperAdmin(input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
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
  await upsertSuperAdmin({
    email: "krishan.kumar@virtualedge.in".toLowerCase(),
    firstName: process.env.SEED_SUPER_ADMIN_FIRST_NAME ?? "Krishan",
    lastName: process.env.SEED_SUPER_ADMIN_LAST_NAME ?? "Kumar",
    password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? "Krishukrishan1211@",
  });

  await seedPlatformPricing();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
