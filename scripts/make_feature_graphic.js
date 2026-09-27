const sharp = require('sharp');

async function createFeatureGraphic() {
  const width = 1024;
  const height = 500;

  // Resize logo for feature banner
  const logo = await sharp('public/logo_colon.png')
    .resize(440, 200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <rect x="262" y="70" width="500" height="240" rx="24" fill="#ffffff" opacity="0.95" />
      <text x="512" y="380" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Plataforma de Servicios y Profesionales
      </text>
      <text x="512" y="425" font-family="Arial, sans-serif" font-size="24" fill="#38bdf8" text-anchor="middle">
        Colón, Entre Ríos
      </text>
    </svg>
  `);

  await sharp(svgOverlay)
    .composite([{ input: logo, top: 90, left: 292 }])
    .png()
    .toFile('public/icons/feature_graphic_1024x500.png');

  console.log('Feature graphic created successfully at public/icons/feature_graphic_1024x500.png');
}

createFeatureGraphic().catch(console.error);
