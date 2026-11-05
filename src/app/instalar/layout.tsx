import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instalá Colón Conecta en tu celular",
  description:
    "Instalá la app de Colón Conecta en tu celular de forma gratuita y sin pasar por la tienda. Disponible para Android e iOS.",
  openGraph: {
    title: "Instalá Colón Conecta en tu celular",
    description:
      "Agregá Colón Conecta a tu pantalla de inicio en segundos. Sin Play Store ni App Store.",
    images: ["/icons/icon-512.png"],
  },
};

export default function InstalarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
