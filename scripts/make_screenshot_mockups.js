const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/icons/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const W = 1080;
const H = 1920;

const screenshotsData = [
  {
    filename: 'screenshot_1.png',
    title: 'Mi Colón',
    tagline: 'Servicios y Profesionales en Colón, Entre Ríos',
    cardTitle: '¿Qué servicio estás buscando?',
    pills: ['⚡ Electricistas', '🔧 Plomeros', '🪴 Jardinería', '❄️ Climatización', '🏥 Enfermería'],
    bgColor: '#0f172a',
    cardBg: '#1e293b',
    accentColor: '#38bdf8',
  },
  {
    filename: 'screenshot_2.png',
    title: 'Explora Categorías y Oficios',
    tagline: 'Trabajadores locales calificados y verificados',
    cardTitle: 'Categorías Destacadas',
    pills: ['🔨 Construcción y Obras', '🚗 Mecánica y Gomería', '🧹 Limpieza de Casas', '📦 Fletes y Mudanzas', '📚 Clases y Apoyo'],
    bgColor: '#047857',
    cardBg: '#065f46',
    accentColor: '#34d399',
  },
  {
    filename: 'screenshot_3.png',
    title: 'Contacto Directo',
    tagline: 'Comunícate por WhatsApp o llamada sin comisiones',
    cardTitle: 'Perfil del Profesional',
    pills: ['✅ Identidad Verificada', '📱 WhatsApp Directo', '⭐ Calificación Excelente', '📍 Ciudad de Colón'],
    bgColor: '#1e1b4b',
    cardBg: '#312e81',
    accentColor: '#818cf8',
  },
  {
    filename: 'screenshot_4.png',
    title: 'Ofrece tus Servicios',
    tagline: 'Regístrate gratis y llega a miles de vecinos',
    cardTitle: 'Únete a Mi Colón',
    pills: ['📝 Registro Rápido', '📸 Galería de Trabajos', '💼 Publicación Gratuita', '📈 Más Clientes'],
    bgColor: '#831843',
    cardBg: '#9d174d',
    accentColor: '#f472b6',
  }
];

async function generateMockupScreenshots() {
  const logoBuffer = await sharp(path.join(__dirname, '../public/logo_colon.png'))
    .resize(360, 160, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  for (const item of screenshotsData) {
    const pillsSvg = item.pills.map((pill, idx) => `
      <rect x="140" y="${920 + idx * 110}" width="800" height="85" rx="42" fill="${item.accentColor}" opacity="0.15" />
      <rect x="140" y="${920 + idx * 110}" width="800" height="85" rx="42" stroke="${item.accentColor}" stroke-width="2" fill="none" />
      <text x="180" y="${975 + idx * 110}" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">
        ${pill}
      </text>
    `).join('');

    const svg = `
      <svg width="${W}" height="${H}">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${item.bgColor}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>

        <!-- Fondo -->
        <rect width="100%" height="100%" fill="url(#bgGrad)" />

        <!-- Encabezados -->
        <text x="540" y="240" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle">
          ${item.title}
        </text>
        <text x="540" y="310" font-family="Arial, sans-serif" font-size="28" fill="${item.accentColor}" text-anchor="middle">
          ${item.tagline}
        </text>

        <!-- Tarjeta Central Mockup de Celular -->
        <rect x="80" y="390" width="920" height="1420" rx="48" fill="${item.cardBg}" stroke="#475569" stroke-width="6" />
        <rect x="120" y="440" width="840" height="240" rx="24" fill="#ffffff" />

        <!-- Subtítulo de Tarjeta -->
        <text x="540" y="810" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="#ffffff" text-anchor="middle">
          ${item.cardTitle}
        </text>

        <!-- Items/Pills -->
        ${pillsSvg}

        <!-- Footer Marca -->
        <text x="540" y="1740" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">
          Plataforma de Servicios • Colón, Entre Ríos
        </text>
      </svg>
    `;

    const filePath = path.join(outDir, item.filename);
    await sharp(Buffer.from(svg))
      .composite([{ input: logoBuffer, top: 480, left: 360 }])
      .png()
      .toFile(filePath);

    console.log(`Generated screenshot: ${filePath}`);
  }
}

generateMockupScreenshots().catch(console.error);
