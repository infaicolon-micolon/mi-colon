import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Mi Colón",
  description: "Política de privacidad de la plataforma Mi Colón de la ciudad de Colón, Entre Ríos.",
};

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content:
      "La plataforma \"Mi Colón\" es la responsable del tratamiento de los datos personales informados por los usuarios al hacer uso de los servicios del portal.",
  },
  {
    title: "2. Datos que se recopilan",
    content:
      "A través del uso de la plataforma pueden recopilarse datos personales, de contacto, laborales, de especialidades y otra información que los usuarios carguen voluntariamente para ofrecer o buscar servicios.",
  },
  {
    title: "3. Carácter de la información declarada",
    content:
      "Toda la información ingresada por el usuario reviste carácter de declaración jurada. El usuario garantiza su veracidad, exactitud, integridad y vigencia. La plataforma no asume responsabilidad directa por inexactitudes ingresadas por terceros.",
  },
  {
    title: "4. Finalidades del tratamiento",
    content:
      "Los datos serán utilizados para conectar vecinos con trabajadores y profesionales locales en Colón, Entre Ríos, facilitar el contacto directo y elaborar estadísticas de uso.",
  },
  {
    title: "5. Base legal y consentimiento",
    content:
      "El tratamiento se realiza conforme a la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y su normativa reglamentaria. Al utilizar el portal, el usuario presta su consentimiento libre, expreso e informado.",
  },
  {
    title: "6. Publicación y acceso por terceros",
    content:
      "El usuario acepta que los datos de su perfil profesional (nombre, teléfono, especialidades y ciudad) sean visibles públicamente en el sitio para que los clientes puedan contactarlo.",
  },
  {
    title: "7. Conservación y seguridad",
    content:
      "Se aplican medidas estándar de seguridad para resguardar la información. No obstante, al tratarse de transmisiones por Internet, el usuario reconoce los riesgos inherentes al uso de plataformas digitales.",
  },
  {
    title: "8. Cookies",
    content:
      "El sitio utiliza cookies exclusivamente con fines funcionales y estadísticos para mejorar la experiencia de navegación.",
  },
  {
    title: "9. Derechos de los usuarios",
    content:
      "El titular de los datos podrá solicitar el acceso, actualización, rectificación o eliminación de sus datos en cualquier momento a través de la sección de soporte o de la configuración de su cuenta.",
  },
  {
    title: "10. Ley aplicable y jurisdicción",
    content:
      "Esta política se rige por las leyes de la República Argentina. Para cualquier controversia, se aplicará la jurisdicción de los Tribunales Ordinarios de la Provincia de Entre Ríos con competencia territorial en la ciudad de Colón.",
  },
];

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
        Política de Privacidad
      </h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400 md:text-base">
        Plataforma &quot;Mi Colón&quot; - Colón, Entre Ríos
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300 md:text-base">
        {sections.map((section) => (
          <article key={section.title} className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white md:text-lg">
              {section.title}
            </h2>
            <p>{section.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
