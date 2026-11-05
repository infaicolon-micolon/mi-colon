import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flyer Promocional - Colón Conecta",
  description: "Flyer promocional para descargar la app Colón Conecta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PromoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
