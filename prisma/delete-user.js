const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "juan.perez@ejemplo.com";
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`Usuario con email ${email} no encontrado.`);
    return;
  }
  
  console.log(`Usuario encontrado: ${user.name} (${user.email}) - ID: ${user.id} - Rol: ${user.role}`);
  
  // Listar modelos disponibles
  const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  console.log("Modelos disponibles:", models.join(', '));
  
  // Borrar registros relacionados que existan
  const deleteOps = [
    { model: 'message', where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } },
    { model: 'review', where: { OR: [{ authorId: user.id }, { professionalId: user.id }] } },
    { model: 'contactRequest', where: { OR: [{ requesterId: user.id }, { professionalId: user.id }] } },
    { model: 'professionalService', where: { professionalId: user.id } },
    { model: 'schedule', where: { professionalId: user.id } },
    { model: 'notification', where: { userId: user.id } },
    { model: 'supportContact', where: { userId: user.id } },
    { model: 'account', where: { userId: user.id } },
    { model: 'session', where: { userId: user.id } },
  ];
  
  for (const op of deleteOps) {
    if (prisma[op.model]) {
      try {
        const result = await prisma[op.model].deleteMany({ where: op.where });
        if (result.count > 0) console.log(`  Eliminados ${result.count} registros de ${op.model}`);
      } catch (e) {
        console.log(`  Saltando ${op.model}: ${e.message.split('\n')[0]}`);
      }
    }
  }
  
  // Borrar el usuario
  await prisma.user.delete({ where: { id: user.id } });
  console.log(`\nUsuario ${user.name} (${email}) ELIMINADO exitosamente.`);
}

main()
  .catch((e) => { console.error("Error:", e.message); })
  .finally(() => prisma.$disconnect());
