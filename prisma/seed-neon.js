const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_1JzmxlA5vPIN@ep-cool-bread-b4et7j5s-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const CATEGORIES_DATA = [
  {
    name: "Oficios e Instalaciones",
    slug: "oficios-e-instalaciones",
    subcategories: [
      { name: "Albañilería", slug: "albanileria", description: "Construcción, refacciones y arreglos generales", icon: "HardHat", image: "/images/categories/albanileria.svg" },
      { name: "Electricidad", slug: "electricidad", description: "Instalaciones eléctricas, tableros y reparaciones", icon: "Zap", image: "/images/categories/electricidad.svg" },
      { name: "Plomería y Gas", slug: "plomeria-y-gas", description: "Instalaciones de agua, gas y destape de cañerías", icon: "Droplet", image: "/images/categories/plomeria.svg" },
      { name: "Pintura", slug: "pintura", description: "Pintura interior, exterior y revestimientos", icon: "Paintbrush", image: "/images/categories/pintura.svg" },
      { name: "Carpintería", slug: "carpinteria", description: "Muebles a medida, aberturas y trabajos en madera", icon: "Hammer", image: "/images/categories/carpinteria.svg" },
      { name: "Jardinería y Parque", slug: "jardineria-y-parque", description: "Corte de césped, poda y mantenimiento de jardines", icon: "Scissors", image: "/images/categories/jardineria.svg" },
      { name: "Aire Acondicionado", slug: "aire-acondicionado", description: "Instalación, service y carga de gas", icon: "Wind", image: "/images/categories/aire-acondicionado.svg" },
      { name: "Cerrajería", slug: "cerrajeria", description: "Aperturas, cambio de combinaciones y duplicados", icon: "Key", image: "/images/categories/cerrajeria.svg" }
    ]
  },
  {
    name: "Servicios Profesionales",
    slug: "servicios-profesionales",
    subcategories: [
      { name: "Contadores y Finanzas", slug: "contadores-y-finanzas", description: "Monotributo, impuestos y balances", icon: "Calculator" },
      { name: "Abogados y Legales", slug: "abogados-y-legales", description: "Asesoramiento jurídico, contratos y trámites", icon: "Scale" },
      { name: "Arquitectura y Diseño", slug: "arquitectura-y-diseno", description: "Planos, proyectos y diseño de interiores", icon: "Compass" },
      { name: "Diseño y Marketing", slug: "diseno-y-marketing", description: "Redes sociales, logos y sitios web", icon: "Layout" }
    ]
  },
  {
    name: "Hogar y Limpieza",
    slug: "hogar-y-limpieza",
    subcategories: [
      { name: "Limpieza Doméstica", slug: "limpieza-domestica", description: "Limpieza de casas y departamentos", icon: "Sparkles" },
      { name: "Fumigación y Control de Plagas", slug: "fumigacion", description: "Desinfección y control de plagas urbano", icon: "ShieldCheck" },
      { name: "Fletes y Mudanzas", slug: "fletes-y-mudanzas", description: "Traslado de muebles y cargas pequeñas", icon: "Truck" }
    ]
  }
];

async function main() {
  console.log("Cargando categorías iniciales en Neon DB...");
  for (const group of CATEGORIES_DATA) {
    const createdGroup = await prisma.categoryGroup.upsert({
      where: { slug: group.slug },
      update: { name: group.name },
      create: { id: crypto.randomUUID(), name: group.name, slug: group.slug },
    });

    for (const sub of group.subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, description: sub.description, icon: sub.icon, groupId: createdGroup.id, backgroundUrl: sub.image || null },
        create: { id: crypto.randomUUID(), name: sub.name, slug: sub.slug, description: sub.description, icon: sub.icon, groupId: createdGroup.id, backgroundUrl: sub.image || null },
      });
    }
  }
  console.log("¡Categorías cargadas exitosamente en Neon DB!");
}

main()
  .catch((e) => { console.error("Error al poblar Neon DB:", e.message); })
  .finally(() => prisma.$disconnect());
