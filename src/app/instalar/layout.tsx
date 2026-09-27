import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instalá Mi Colón en tu celular",
  description:
    "Instalá la app de Mi Colón en tu celular de forma gratuita y sin pasar por la tienda. Disponible para Android e iOS.",
  openGraph: {
    title: "Instalá Mi Colón en tu celular",
    description:
      "Agregá Mi Colón a tu pantalla de inicio en segundos. Sin Play Store ni App Store.",
    images: ["/icons/icon-512.png"],
  },
};

export default function InstalarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
