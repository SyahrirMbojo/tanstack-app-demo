import { PrismaClient } from "../src/generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";
import { users } from "./seeder/dataseeder.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function createUser() {
  const usercreate = await prisma.user.createMany({
    data: users,
  });
  console.log(`✅ Created ${usercreate.count} users`);
}

async function main() {
  console.log("🌱 Seeding database...");

  await createUser();
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
