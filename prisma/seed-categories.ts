import { PrismaClient } from '@prisma/client';
import { AREAS_OFICIOS, SUBCATEGORIES_OFICIOS, SUBCATEGORIES_PROFESIONES } from '../src/lib/taxonomy';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Iniciando seed de categorías...');



  // 2. Crear/actualizar áreas de oficios (categorías padre)
  const areaMap = new Map<string, string>(); // slug -> id

  for (const area of AREAS_OFICIOS) {
    const created = await prisma.category.upsert({
      where: { slug: area.slug },
      update: {
        name: area.name,
        description: area.name,
        backgroundUrl: area.image,
      },
      create: {
        name: area.name,
        slug: area.slug,
        description: area.name,
        groupId: 'oficios',
        parentCategoryId: null, // Es un área, no tiene padre
        backgroundUrl: area.image,
        active: true,
      },
    });
    areaMap.set(area.slug, created.id);
    console.log(`  📁 Área creada: ${area.name}`);
  }

  console.log('✅ Áreas de oficios creadas');

  // 3. Crear/actualizar subcategorías de oficios
  for (const subcat of SUBCATEGORIES_OFICIOS) {
    const parentId = subcat.areaSlug ? areaMap.get(subcat.areaSlug) : null;
    
    if (subcat.areaSlug && !parentId) {
      console.warn(`⚠️  Área padre no encontrada para ${subcat.name}: ${subcat.areaSlug}`);
      continue;
    }

    await prisma.category.upsert({
      where: { slug: subcat.slug },
      update: {
        name: subcat.name,
        description: subcat.name,
        parentCategoryId: parentId,
        backgroundUrl: subcat.image,
      },
      create: {
        name: subcat.name,
        slug: subcat.slug,
        description: subcat.name,
        groupId: 'oficios',
        parentCategoryId: parentId,
        backgroundUrl: subcat.image,
        active: true,
      },
    });
    console.log(`    🔧 Subcategoría creada: ${subcat.name}`);
  }

  console.log('✅ Subcategorías de oficios creadas');

  // 4. Crear/actualizar subcategorías de profesiones (sin padre)
  for (const subcat of SUBCATEGORIES_PROFESIONES) {
    await prisma.category.upsert({
      where: { slug: subcat.slug },
      update: {
        name: subcat.name,
        description: subcat.name,
        backgroundUrl: subcat.image,
      },
      create: {
        name: subcat.name,
        slug: subcat.slug,
        description: subcat.name,
        groupId: 'profesiones',
        parentCategoryId: null, // Profesiones no tienen área padre
        backgroundUrl: subcat.image,
        active: true,
      },
    });
    console.log(`    🎓 Profesión creada: ${subcat.name}`);
  }

  console.log('✅ Subcategorías de profesiones creadas');

  // Resumen
  const totalCategories = await prisma.category.count();
  const totalAreas = await prisma.category.count({ where: { parentCategoryId: null, groupId: 'oficios' } });
  const totalSubcatOficios = await prisma.category.count({ where: { parentCategoryId: { not: null }, groupId: 'oficios' } });
  const totalProfesiones = await prisma.category.count({ where: { groupId: 'profesiones' } });

  console.log('\n📊 Resumen:');
  console.log(`  Total de categorías: ${totalCategories}`);
  console.log(`  Áreas de oficios: ${totalAreas}`);
  console.log(`  Subcategorías de oficios: ${totalSubcatOficios}`);
  console.log(`  Profesiones: ${totalProfesiones}`);
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });