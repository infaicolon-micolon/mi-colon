const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const oldEmail = "admin@ceres.gob.ar";
  const newEmail = "admin@micolon.com";
  const newPassword = "123456";

  const user = await prisma.user.findUnique({ where: { email: oldEmail } });

  if (!user) {
    console.log(`Usuario con email ${oldEmail} no encontrado.`);
    return;
  }

  console.log(`Usuario encontrado: ${user.name} (${user.email})`);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: newEmail,
      password: hashedPassword,
    },
  });

  console.log(`\nUsuario actualizado exitosamente:`);
  console.log(`  Email: ${oldEmail} -> ${newEmail}`);
  console.log(`  Password: ${newPassword}`);
}

main()
  .catch((e) => { console.error("Error:", e.message); })
  .finally(() => prisma.$disconnect());
