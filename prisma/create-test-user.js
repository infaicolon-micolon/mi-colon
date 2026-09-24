const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ceres.gob.ar' },
    update: {
      password: hashedPassword,
      verified: true,
      role: 'admin',
    },
    create: {
      email: 'admin@ceres.gob.ar',
      firstName: 'Admin',
      lastName: 'Ceres',
      name: 'Admin Ceres',
      password: hashedPassword,
      role: 'admin',
      verified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Usuario Admin listo:');
  console.log('  Email: admin@ceres.gob.ar');
  console.log('  Password: password123');

  // 2. Professional user
  const profUser = await prisma.user.upsert({
    where: { email: 'juan.perez@ejemplo.com' },
    update: {
      password: hashedPassword,
      verified: true,
      role: 'professional',
    },
    create: {
      email: 'juan.perez@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      name: 'Juan Pérez',
      password: hashedPassword,
      phone: '3491123456',
      dni: '12345678',
      role: 'professional',
      verified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create professional profile for Juan
  await prisma.professional.upsert({
    where: { userId: profUser.id },
    update: { status: 'active', verified: true },
    create: {
      userId: profUser.id,
      bio: 'Electricista y plomero matriculado con más de 10 años de experiencia en Ceres.',
      experienceYears: 10,
      verified: true,
      status: 'active',
      rating: 5.0,
      whatsapp: '3491123456',
      location: 'Ceres, Santa Fe',
      specialties: ['Electricidad', 'Plomería'],
    },
  });

  console.log('Usuario Profesional listo:');
  console.log('  Email: juan.perez@ejemplo.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
