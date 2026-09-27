import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flyer Promocional - Mi Colón",
  description: "Flyer promocional para descargar la app Mi Colón",
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
