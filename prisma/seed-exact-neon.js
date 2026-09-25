const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const AREAS_OFICIOS = [
  { name: "Construcción y mantenimiento", slug: "construccion-mantenimiento", image: "/images/servicios/construccion.jpg" },
  { name: "Climatización", slug: "climatizacion", image: "/images/servicios/climatizacion.jpg" },
  { name: "Servicios técnicos electrónicos", slug: "servicios-electronicos", image: "/images/servicios/electricista.webp" },
  { name: "Automotores", slug: "automotores", image: "/images/servicios/automotores.jpg" },
  { name: "Jardinería", slug: "jardineria", image: "/images/servicios/jardineria.jpg" },
  { name: "Cocina", slug: "cocina", image: "/images/servicios/cocina.jpg" },
  { name: "Otros", slug: "otros", image: "/images/servicios/construccion.jpg" }
];

const SUBCATEGORIES_OFICIOS = [
  { name: "Plomero/a", slug: "plomero", areaSlug: "construccion-mantenimiento", image: "/images/servicios/construccion.jpg" },
  { name: "Electricista", slug: "electricista", areaSlug: "construccion-mantenimiento", image: "/servicios/electricista.webp" },
  { name: "Albañil", slug: "albanil", areaSlug: "construccion-mantenimiento", image: "/servicios/albanileria.jpg" },
  { name: "Gasista", slug: "gasista", areaSlug: "construccion-mantenimiento", image: "/servicios/gasista.jpg" },
  { name: "Pintor de obra", slug: "pintor-obra", areaSlug: "construccion-mantenimiento", image: "/images/servicios/construccion.jpg" },
  { name: "Carpintero/a", slug: "carpintero", areaSlug: "construccion-mantenimiento", image: "/images/servicios/construccion.jpg" },
  { name: "Cerrajería", slug: "cerrajeria", areaSlug: "construccion-mantenimiento", image: "/images/servicios/cerrajeria.jpg" },
  { name: "Limpieza", slug: "limpieza", areaSlug: "construccion-mantenimiento", image: "/images/servicios/limpieza.jpg" },
  { name: "Técnico en aires acondicionados", slug: "tecnico-aires", areaSlug: "climatizacion", image: "/servicios/instalacion-aires.jpg" },
  { name: "Servicios técnicos electrónicos", slug: "servicios-electronicos", areaSlug: "servicios-electronicos", image: "/images/servicios/electricista.webp" },
  { name: "Mecánico automotriz", slug: "mecanico-automotriz", areaSlug: "automotores", image: "/images/servicios/automotores.jpg" },
  { name: "Jardinero/a", slug: "jardinero", areaSlug: "jardineria", image: "/images/servicios/jardineria.jpg" },
  { name: "Costura", slug: "costura", areaSlug: "otros", image: "/images/servicios/costura.jpg" },
  { name: "Cuidados", slug: "cuidados", areaSlug: "otros", image: "/images/servicios/cuidados.jpg" },
  { name: "Fletes y mudanzas", slug: "fletes-mudanzas", areaSlug: "otros", image: "/images/servicios/fletes-mudanzas.jpg" }
];

const SUBCATEGORIES_PROFESIONES = [
  { name: "Enfermería", slug: "enfermeria", image: "/images/profesionales/enfermeria.jpg" },
  { name: "Arquitectura", slug: "arquitectura", image: "/images/profesionales/arquitectura.jpg" },
  { name: "Marketing", slug: "marketing", image: "/images/profesionales/marketing.png" },
  { name: "Abogacía", slug: "abogacia", image: "/images/profesionales/abogacia.jpg" },
  { name: "Contaduría", slug: "contaduria", image: "/images/profesionales/contaduria.jpg" },
  { name: "Entrenadores físicos", slug: "entrenadores-fisicos", image: "/images/profesionales/entrenadores-fisicos.jpg" }
];

async function seed() {
  console.log("Limpiando categorías anteriores en Neon DB...");
  await prisma.category.deleteMany({});
  await prisma.categoryGroup.deleteMany({});

  console.log("Creando grupos de categorías en Neon DB...");
  await prisma.categoryGroup.createMany({
    data: [
      { id: "oficios", name: "Oficios", slug: "oficios" },
      { id: "profesiones", name: "Profesiones", slug: "profesiones" }
    ]
  });

  const areaMap = new Map();

  for (const area of AREAS_OFICIOS) {
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
      }
    });
    areaMap.set(area.slug, created.id);
  }

  for (const subcat of SUBCATEGORIES_OFICIOS) {
    const parentId = subcat.areaSlug ? areaMap.get(subcat.areaSlug) : null;
    await prisma.category.create({
      data: {
        name: subcat.name,
        slug: subcat.slug,
        description: subcat.name,
        groupId: "oficios",
        parentCategoryId: parentId,
        backgroundUrl: subcat.image,
        active: true,
        showOnHome: true,
      }
    });
  }

  for (const subcat of SUBCATEGORIES_PROFESIONES) {
    await prisma.category.create({
      data: {
        name: subcat.name,
        slug: subcat.slug,
        description: subcat.name,
        groupId: "profesiones",
        parentCategoryId: null,
        backgroundUrl: subcat.image,
        active: true,
        showOnHome: true,
      }
    });
  }

  console.log("✅ ¡Categorías e imágenes vinculadas perfectamente en Neon DB!");
}

seed()
  .catch((e) => { console.error("Error:", e.message); })
  .finally(() => prisma.$disconnect());
