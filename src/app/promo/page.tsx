"use client";

import NextImage from "next/image";
import Link from "next/link";

const shareUrl = "https://mi-colon-er.vercel.app/instalar";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=006F4B&margin=15`;

export default function PromoFlyerPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3 sm:p-6 md:p-10">
      {/* Contenedor del Flyer (Ajustado y Responsive) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#006F4B] via-[#005A3D] to-[#004730] w-full max-w-lg sm:max-w-xl shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 text-white border border-white/10 flex flex-col items-center">
        
        {/* Adornos visuales de fondo */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500 rounded-full blur-[100px] opacity-25 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#008F5B] rounded-full blur-[90px] opacity-40 pointer-events-none" />

        {/* Encabezado */}
        <div className="z-10 flex flex-col items-center text-center w-full">
          {/* Logo con fondo blanco */}
          <div className="bg-white px-6 py-4 rounded-2xl shadow-xl mb-6 inline-flex items-center justify-center">
            <NextImage
              src="/logo_colon.png"
              alt="Logo Mi Colón"
              width={200}
              height={80}
              className="object-contain h-14 w-auto"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-3 tracking-tight leading-tight">
            La ciudad en tus manos
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-md leading-relaxed font-medium mb-5">
            Plataforma integral de servicios y profesionales para Colón y la región.
          </p>

          <div className="bg-black/25 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 text-center text-xs sm:text-sm font-semibold text-emerald-100 mb-6">
            🛠️ Encontrá lo que necesitás, conectá con el talento local.
          </div>
        </div>

        {/* Sección Tarjeta Blanca (QR + Tiendas + Link) */}
        <div className="z-10 w-full bg-white text-gray-900 rounded-2xl p-5 sm:p-7 shadow-2xl border-t-8 border-amber-500 flex flex-col items-center gap-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-[#006F4B]">¡Instalá la App gratis!</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Disponible para Android e iOS</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full">
            {/* Código QR */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 border-2 border-dashed border-emerald-600/30 rounded-2xl bg-emerald-50/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={QR_URL} 
                  alt="Código QR para descargar app" 
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl object-contain bg-white"
                  crossOrigin="anonymous" 
                />
              </div>
              <span className="text-xs font-bold text-[#006F4B] bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                📷 Escaneá con tu cámara
              </span>
            </div>

            {/* Badges de Tiendas (Originales subidos por el usuario) */}
            <div className="flex flex-col gap-4 items-center justify-center">
              {/* Badge Google Play */}
              <div className="w-[180px] h-[54px] relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/store-badges.png" 
                  alt="Get it on Google Play"
                  className="absolute w-[180px] h-[115px] object-cover top-0 left-0"
                />
              </div>

              {/* Badge App Store */}
              <div className="w-[180px] h-[54px] relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/store-badges.png" 
                  alt="Download on the App Store"
                  className="absolute w-[180px] h-[115px] object-cover bottom-0 left-0"
                />
              </div>
            </div>
          </div>

          {/* Cuadro destacado para el Link de Instalación Directa */}
          <div className="w-full bg-emerald-50/90 rounded-xl p-4 border border-emerald-200 text-center space-y-1 mt-1 shadow-inner">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              O ingresá desde el navegador a:
            </p>
            <Link 
              href="/instalar" 
              target="_blank"
              className="text-base sm:text-lg font-black text-[#006F4B] hover:text-amber-600 transition-colors tracking-wide underline decoration-amber-500 decoration-2 underline-offset-4 block break-all"
            >
              mi-colon-er.vercel.app/instalar
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
