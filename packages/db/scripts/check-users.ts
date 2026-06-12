import { prisma } from "../src/index.js";

const users = await prisma.user.findMany({
  select: { email: true, role: true, status: true, organizationId: true },
  orderBy: { email: "asc" },
});
console.log(JSON.stringify(users, null, 2));
await prisma.$disconnect();
