import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Mi Colón",
  description: "Términos, bases y condiciones de la plataforma Mi Colón.",
};

const termsParagraphs = [
  "Aceptación de los términos: El acceso y/o uso de la plataforma \"Mi Colón\" implica la adhesión plena, expresa y sin reservas a los presentes términos y condiciones de uso.",
  "Titularidad de la plataforma: El portal \"Mi Colón\" es una plataforma independiente destinada a conectar profesionales y trabajadores independientes con vecinos y clientes en la ciudad de Colón, Entre Ríos y zonas aledañas.",
  "Acceso: El acceso a la plataforma es libre para los usuarios. Quienes deseen ofrecer sus servicios deberán registrarse creando una cuenta de usuario y completando su perfil profesional.",
  "Responsabilidad sobre la información: Toda información ingresada por los usuarios (datos personales, laborales, fotos y servicios) reviste carácter de declaración jurada. El usuario garantiza su veracidad, exactitud y vigencia.",
  "Exoneración de responsabilidad: La plataforma \"Mi Colón\" actúa como un nexo directo entre prestadores de servicios y clientes. No intermedia en la contratación ni en los pagos de los trabajos acordados entre las partes, siendo la responsabilidad de los trabajos prestados exclusiva del profesional contratado.",
  "Protección de datos personales: El tratamiento de datos se realiza en conformidad con la Ley N° 25.326 de Protección de Datos Personales de la República Argentina.",
  "Modificación de los términos: La plataforma se reserva el derecho de modificar o actualizar estos términos en cualquier momento, entrando en vigencia desde su publicación en el sitio web.",
  "Jurisdicción y ley aplicable: Los presentes términos se rigen por las leyes de la República Argentina y la jurisdicción de los Tribunales Ordinarios de la Provincia de Entre Ríos, sede Colón.",
];

export default function TerminosYCondicionesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
        Términos, Bases y Condiciones
      </h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400 md:text-base">
        Plataforma &quot;Mi Colón&quot; - Colón, Entre Ríos
      </p>

      <section className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 md:text-base">
        {termsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </main>
  );
}
