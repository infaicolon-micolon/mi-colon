import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProviders } from "@/components/providers/AuthProviders";
import { authOptions } from "@/app/api/auth/options";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
import { getBaseUrl, generateOrganizationStructuredData } from "@/lib/seo";
import { getPublicCategoryTree } from "@/lib/server/categories";
import { PublicCategoriesTreeProvider } from "@/hooks/usePublicCategoriesTree";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const baseUrl = getBaseUrl();
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Mi Colón - Servicios y Profesionales",
    template: "%s | Mi Colón"
  },
  description: "Plataforma de servicios y profesionales de Colón, Entre Ríos. Encuentra personas verificadas para todas tus necesidades.",
  keywords: ["servicios", "profesionales", "Colón", "Entre Ríos", "plomería", "electricidad", "construcción", "Argentina", "Mi Colón"],
  authors: [{ name: "Mi Colón" }],
  creator: "Mi Colón",
  publisher: "Mi Colón",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/logo_colon.png",
    shortcut: "/logo_colon.png",
    apple: "/logo_colon.png",
  },
  openGraph: {
    title: "Mi Colón - Plataforma de Servicios",
    description: "Encuentra profesionales en Colón, Entre Ríos. Plataforma de servicios locales.",
    url: baseUrl,
    siteName: "Mi Colón",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: `${baseUrl}/logo_colon.png`,
        width: 400,
        height: 400,
        alt: "Mi Colón - Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Colón - Servicios y Profesionales",
    description: "Encuentra profesionales en Colón, Entre Ríos",
    images: [`${baseUrl}/logo_colon.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verificación de Google Search Console
  // Agregar variable de entorno: GOOGLE_SITE_VERIFICATION con el código de verificación
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const [session, publicCategories] = await Promise.all([
    getServerSession(authOptions),
    getPublicCategoryTree().catch((error) => {
      console.error("Error cargando categorias publicas en layout:", error);
      return {
        areas: [],
        subcategoriesOficios: [],
        subcategoriesProfesiones: [],
      };
    }),
  ]);
  const organizationData = generateOrganizationStructuredData();

  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased flex flex-col overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg dark:focus:bg-gray-900 dark:focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        {gaMeasurementId ? <GoogleAnalytics measurementId={gaMeasurementId} /> : null}
        <AuthProviders session={session}>
          <PublicCategoriesTreeProvider data={publicCategories}>
            <Header />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 w-full overflow-x-hidden"
              style={{ overflowY: 'auto' }}
            >
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </PublicCategoriesTreeProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
