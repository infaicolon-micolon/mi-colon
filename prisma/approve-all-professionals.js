const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  console.log("Aprobando profesionales pendientes en Neon DB...");
  
  const updated = await prisma.professional.updateMany({
    where: {
      status: { in: ['pending', 'suspended'] }
    },
    data: {
      status: 'active',
      verified: true,
    }
  });

  console.log(`✅ ¡Se aprobaron y activaron ${updated.count} perfiles profesionales en la web!`);
}

main()
  .catch((e) => console.error("Error al aprobar:", e.message))
  .finally(() => prisma.$disconnect());
