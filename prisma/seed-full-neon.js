const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const AREAS_OFICIOS = [
  { name: "Construcción e Instalaciones", slug: "construccion-e-instalaciones", image: "/images/categories/albanileria.svg" },
  { name: "Mantenimiento del Hogar", slug: "mantenimiento-del-hogar", image: "/images/categories/electricidad.svg" },
  { name: "Automotor y Transporte", slug: "automotor-y-transporte", image: "/images/categories/carpinteria.svg" },
  { name: "Estética y Cuidado Personal", slug: "estetica-y-cuidado-personal", image: "/images/categories/jardineria.svg" },
  { name: "Gastronomía y Eventos", slug: "gastronomia-y-eventos", image: "/images/categories/pintura.svg" },
  { name: "Textil y Calzado", slug: "textil-y-calzado", image: "/images/categories/plomeria.svg" }
];

const SUBCATEGORIES_OFICIOS = [
  { name: "Albañil / Albañilería", slug: "albanil", areaSlug: "construccion-e-instalaciones", image: "/images/categories/albanileria.svg" },
  { name: "Electricista", slug: "electricista", areaSlug: "construccion-e-instalaciones", image: "/images/categories/electricidad.svg" },
  { name: "Plomero / Gasista", slug: "plomero-gasista", areaSlug: "construccion-e-instalaciones", image: "/images/categories/plomeria.svg" },
  { name: "Pintor", slug: "pintor", areaSlug: "construccion-e-instalaciones", image: "/images/categories/pintura.svg" },
  { name: "Carpintero", slug: "carpintero", areaSlug: "construccion-e-instalaciones", image: "/images/categories/carpinteria.svg" },
  { name: "Jardinero / Poda", slug: "jardinero-poda", areaSlug: "mantenimiento-del-hogar", image: "/images/categories/jardineria.svg" },
  { name: "Cerrajero", slug: "cerrajero", areaSlug: "mantenimiento-del-hogar", image: "/images/categories/cerrajeria.svg" },
  { name: "Técnico en Aire Acondicionado", slug: "tecnico-aire-acondicionado", areaSlug: "mantenimiento-del-hogar", image: "/images/categories/aire-acondicionado.svg" },
  { name: "Mecánico", slug: "mecanico", areaSlug: "automotor-y-transporte", image: "/images/categories/carpinteria.svg" },
  { name: "Peluquero / Barbería", slug: "peluquero-barberia", areaSlug: "estetica-y-cuidado-personal", image: "/images/categories/jardineria.svg" },
  { name: "Cocinero / Catering", slug: "cocinero-catering", areaSlug: "gastronomia-y-eventos", image: "/images/categories/pintura.svg" },
  { name: "Costurera / Modista", slug: "costurera-modista", areaSlug: "textil-y-calzado", image: "/images/categories/plomeria.svg" }
];

const SUBCATEGORIES_PROFESIONES = [
  { name: "Abogado / Asesor Legal", slug: "abogado", image: "/images/categories/albanileria.svg" },
  { name: "Contador / Finanzas", slug: "contador", image: "/images/categories/electricidad.svg" },
  { name: "Arquitecto / Maestro Mayor de Obras", slug: "arquitecto", image: "/images/categories/carpinteria.svg" },
  { name: "Diseñador Web / Programador", slug: "disenador-web", image: "/images/categories/aire-acondicionado.svg" },
  { name: "Médico / Salud", slug: "medico", image: "/images/categories/jardineria.svg" },
  { name: "Psicólogo / Psicopedagogo", slug: "psicologo", image: "/images/categories/pintura.svg" },
  { name: "Profesor / Clases Particulares", slug: "profesor", image: "/images/categories/plomeria.svg" }
];

async function seed() {
  console.log("🌱 Creando grupos de categorías en Neon DB...");
  
  await prisma.categoryGroup.upsert({
    where: { id: "oficios" },
    update: { name: "Oficios e Instalaciones", slug: "oficios" },
    create: { id: "oficios", name: "Oficios e Instalaciones", slug: "oficios" },
  });

  await prisma.categoryGroup.upsert({
    where: { id: "profesiones" },
    update: { name: "Servicios Profesionales", slug: "profesiones" },
    create: { id: "profesiones", name: "Servicios Profesionales", slug: "profesiones" },
  });

  const areaMap = new Map();

  for (const area of AREAS_OFICIOS) {
    const created = await prisma.category.upsert({
      where: { slug: area.slug },
      update: { name: area.name, description: area.name, backgroundUrl: area.image, active: true },
      create: { name: area.name, slug: area.slug, description: area.name, groupId: "oficios", parentCategoryId: null, backgroundUrl: area.image, active: true },
    });
    areaMap.set(area.slug, created.id);
  }

  for (const subcat of SUBCATEGORIES_OFICIOS) {
    const parentId = subcat.areaSlug ? areaMap.get(subcat.areaSlug) : null;
    await prisma.category.upsert({
      where: { slug: subcat.slug },
      update: { name: subcat.name, description: subcat.name, parentCategoryId: parentId, backgroundUrl: subcat.image, active: true },
      create: { name: subcat.name, slug: subcat.slug, description: subcat.name, groupId: "oficios", parentCategoryId: parentId, backgroundUrl: subcat.image, active: true },
    });
  }

  for (const subcat of SUBCATEGORIES_PROFESIONES) {
    await prisma.category.upsert({
      where: { slug: subcat.slug },
      update: { name: subcat.name, description: subcat.name, backgroundUrl: subcat.image, active: true },
      create: { name: subcat.name, slug: subcat.slug, description: subcat.name, groupId: "profesiones", parentCategoryId: null, backgroundUrl: subcat.image, active: true },
    });
  }

  console.log("✅ ¡Categorías y profesiones pobladas correctamente en Neon DB!");
}

seed()
  .catch((e) => { console.error("Error:", e.message); })
  .finally(() => prisma.$disconnect());
