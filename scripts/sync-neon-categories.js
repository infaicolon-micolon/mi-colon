const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const AREAS = [
  { name: "Construcción y mantenimiento", slug: "construccion-mantenimiento", image: "/images/servicios/construccion.jpg" },
  { name: "Climatización", slug: "climatizacion", image: "/images/servicios/climatizacion.jpg" },
  { name: "Servicios técnicos electrónicos", slug: "servicios-electronicos", image: "/images/servicios/electricista.webp" },
  { name: "Automotores", slug: "automotores", image: "/images/servicios/automotores.jpg" },
  { name: "Jardinería", slug: "jardineria", image: "/images/servicios/jardineria.jpg" },
  { name: "Cocina", slug: "cocina", image: "/images/servicios/cocina.jpg" },
  { name: "Otros", slug: "otros", image: "/images/servicios/construccion.jpg" },
];

const SUBCATEGORIES = [
  // Construcción y mantenimiento
  { name: "Plomero/a", slug: "plomero", areaSlug: "construccion-mantenimiento" },
  { name: "Electricista", slug: "electricista", areaSlug: "construccion-mantenimiento" },
  { name: "Albañil", slug: "albanil", areaSlug: "construccion-mantenimiento" },
  { name: "Gasista", slug: "gasista", areaSlug: "construccion-mantenimiento" },
  { name: "Pintor de obra", slug: "pintor-obra", areaSlug: "construccion-mantenimiento" },
  { name: "Carpintero/a", slug: "carpintero", areaSlug: "construccion-mantenimiento" },
  { name: "Herrero/a", slug: "herrero", areaSlug: "construccion-mantenimiento" },
  { name: "Yesero", slug: "yesero", areaSlug: "construccion-mantenimiento" },
  { name: "Techista", slug: "techista", areaSlug: "construccion-mantenimiento" },
  { name: "Cerrajería", slug: "cerrajeria", areaSlug: "construccion-mantenimiento" },
  { name: "Cerrajeros", slug: "cerrajero", areaSlug: "construccion-mantenimiento" },
  { name: "Limpieza", slug: "limpieza", areaSlug: "construccion-mantenimiento" },

  // Climatización
  { name: "Técnico en aires acondicionados", slug: "tecnico-aires", areaSlug: "climatizacion" },
  { name: "Refrigeración comercial y hogareña", slug: "refrigeracion", areaSlug: "climatizacion" },

  // Servicios técnicos electrónicos
  { name: "Reparador de electrodomésticos", slug: "reparador-electrodomesticos", areaSlug: "servicios-electronicos" },
  { name: "Técnico en celulares y tablets", slug: "tecnico-celulares", areaSlug: "servicios-electronicos" },

  // Automotores
  { name: "Mecánico automotriz", slug: "mecanico-automotriz", areaSlug: "automotores" },
  { name: "Mecánico de motos", slug: "mecanico-motos", areaSlug: "automotores" },
  { name: "Chapista", slug: "chapista", areaSlug: "automotores" },
  { name: "Gomería", slug: "gomero", areaSlug: "automotores" },

  // Jardinería
  { name: "Jardinero/a", slug: "jardinero", areaSlug: "jardineria" },
  { name: "Paisajista", slug: "paisajista", areaSlug: "jardineria" },

  // Cocina
  { name: "Pastelería", slug: "pasteleria", areaSlug: "cocina" },
  { name: "Panificados", slug: "panificados", areaSlug: "cocina" },

  // Otros
  { name: "Costura", slug: "costura", areaSlug: "otros" },
  { name: "Costurera", slug: "costurera", areaSlug: "otros" },
  { name: "Cuidados", slug: "cuidados", areaSlug: "otros" },
  { name: "Promotores gerontológicos", slug: "promotores-gerontologicos", areaSlug: "otros" },
  { name: "Niñera", slug: "ninera", areaSlug: "otros" },
  { name: "Fletes y mudanzas", slug: "fletes-mudanzas", areaSlug: "otros" },
];

async function sync() {
  console.log("🔄 Sincronizando categorías en Neon DB...");

  // 1. Asegurar grupo oficios
  await prisma.categoryGroup.upsert({
    where: { id: "oficios" },
    update: { name: "Oficios", slug: "oficios" },
    create: { id: "oficios", name: "Oficios", slug: "oficios" },
  });

  const areaMap = new Map();

  // 2. Crear / actualizar áreas principales
  for (const area of AREAS) {
    const existing = await prisma.category.findUnique({ where: { slug: area.slug } });
    if (existing) {
      const updated = await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: area.name,
          parentCategoryId: null,
          groupId: "oficios",
          active: true,
          showOnHome: true,
        },
      });
      areaMap.set(area.slug, updated.id);
      console.log(`  📁 Área actualizada: ${area.name} (${updated.id})`);
    } else {
      const created = await prisma.category.create({
        data: {
          name: area.name,
          slug: area.slug,
          description: area.name,
          groupId: "oficios",
          parentCategoryId: null,
          backgroundUrl: area.image,
          active: true,
          showOnHome: true,
        },
      });
      areaMap.set(area.slug, created.id);
      console.log(`  📁 Área creada: ${area.name} (${created.id})`);
    }
  }

  // 3. Crear / vincular subcategorías a su área correspondiente
  for (const subcat of SUBCATEGORIES) {
    const parentId = areaMap.get(subcat.areaSlug);
    if (!parentId) {
      console.warn(`  ⚠️ No se encontró área para subcategoría ${subcat.name} (${subcat.areaSlug})`);
      continue;
    }

    const existing = await prisma.category.findUnique({ where: { slug: subcat.slug } });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: subcat.name,
          parentCategoryId: parentId,
          groupId: "oficios",
          active: true,
        },
      });
      console.log(`    🔧 Subcategoría vinculada: ${subcat.name} -> ${subcat.areaSlug}`);
    } else {
      await prisma.category.create({
        data: {
          name: subcat.name,
          slug: subcat.slug,
          description: subcat.name,
          groupId: "oficios",
          parentCategoryId: parentId,
          active: true,
        },
      });
      console.log(`    🔧 Subcategoría creada: ${subcat.name} -> ${subcat.areaSlug}`);
    }
  }

  console.log("✅ Categorías sincronizadas exitosamente en Neon DB.");
}

sync()
  .catch((err) => {
    console.error("❌ Error sincronizando Neon DB:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
