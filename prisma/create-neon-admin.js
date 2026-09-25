const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  const email = "admin@micolon.com";
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      name: "Admin Mi Colón",
      firstName: "Admin",
      lastName: "Mi Colón",
      password: hashedPassword,
      role: "admin",
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`Admin creado/actualizado en Neon: ${admin.name} (${admin.email}) - ID: ${admin.id}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => { console.error("Error:", e.message); })
  .finally(() => prisma.$disconnect());
