"use client";

import NextImage from "next/image";

// Logo App Store SVG Original
function AppStoreBadge() {
  return (
    <svg viewBox="0 0 135 40" width="135" height="40" xmlns="http://www.w3.org/2000/svg">
      <path d="M130.2 0H4.8C2.1 0 0 2.1 0 4.8v30.3C0 37.9 2.1 40 4.8 40h125.3c2.7 0 4.8-2.1 4.8-4.8V4.8c.1-2.7-2-4.8-4.7-4.8z" fill="#000"/>
      <path d="M102 24.3c0-3.3 2.7-4.9 2.8-5-1.5-2.2-3.8-2.5-4.7-2.6-2-.2-3.9 1.2-4.9 1.2s-2.6-1.1-4.2-1.1c-2.1 0-4.1 1.2-5.1 3-2.2 3.7-.6 9.3 1.5 12.3 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 4-1 1.8 0 2.4 1 4 1 1.6.1 2.6-1.3 3.6-2.8 1.2-1.7 1.7-3.4 1.7-3.5-.1-.1-2.5-1-2.5-4.5zM98 14.8c1-1.2 1.6-2.9 1.4-4.5-1.4.1-3.2.9-4.2 2.1-.8 1-1.5 2.7-1.3 4.3 1.5.1 3.1-.7 4.1-1.9zM20.2 28.5l-3.3-8.8h-4v8.8h-1.9V13h5.7c2.9 0 4.9 1.7 4.9 4.3 0 1.9-1 3.1-2.4 3.7l3.6 7.5h-2.6zm-7.3-10.4h3.7c1.8 0 3-.9 3-2.6 0-1.7-1.1-2.6-3-2.6h-3.7v5.2zM24 23.4c0-3.4 2.5-5.3 6.1-5.3 1.3 0 2.4.3 3.1.6v1.6c-.7-.4-1.7-.7-3-.7-2.3 0-4.1 1.2-4.1 3.7 0 2.4 1.8 3.7 4.1 3.7 1.3 0 2.3-.3 3-.7v1.6c-.8.4-1.8.6-3.1.6-3.6.1-6.1-1.7-6.1-5.1zM35.6 28.5V13h1.9v15.5h-1.9zM40 28.5V13h1.9v15.5H40zM57.7 21c0 4.8-3.3 7.8-7.5 7.8-4.2 0-7.5-3-7.5-7.8 0-4.8 3.3-7.8 7.5-7.8 4.2.1 7.5 3 7.5 7.8zm-13.1 0c0 3.8 2.3 6.1 5.5 6.1 3.2 0 5.5-2.3 5.5-6.1s-2.3-6.1-5.5-6.1c-3.1-.1-5.5 2.2-5.5 6.1zM59.4 28.5v-11h1.8v1.6c.9-1.2 2.3-1.8 4-1.8 3.1 0 5.5 2.4 5.5 5.8s-2.3 5.8-5.5 5.8c-1.6 0-3.1-.6-4-1.8v5.5h-1.8zm5.7-1.5c2.3 0 3.8-1.7 3.8-4.3s-1.5-4.3-3.8-4.3-3.8 1.7-3.8 4.3 1.5 4.3 3.8 4.3zM75 17.5h-2.1v7.6c0 1.2.6 1.7 1.6 1.7.5 0 1-.1 1.4-.3v1.5c-.6.3-1.3.4-2 .4-1.9 0-2.9-1.1-2.9-3V17.5H69V16h2.1v-2.8h1.9V16H75v1.5zM76.8 23.4c0-3.4 2.5-5.3 6.1-5.3 1.3 0 2.4.3 3.1.6v1.6c-.7-.4-1.7-.7-3-.7-2.3 0-4.1 1.2-4.1 3.7 0 2.4 1.8 3.7 4.1 3.7 1.3 0 2.3-.3 3-.7v1.6c-.8.4-1.8.6-3.1.6-3.6.1-6.1-1.7-6.1-5.1zM89.7 28.5v-7.3c0-2.3-1.2-3.4-3-3.4-1.9 0-3.1 1.1-3.1 3.5v7.2h-1.9v-11h1.8v1.5c1-1.2 2.3-1.7 3.7-1.7 2.6 0 4.3 1.6 4.3 4.5v6.8h-1.8zM116.2 21c0 4.8-3.3 7.8-7.5 7.8-4.2 0-7.5-3-7.5-7.8 0-4.8 3.3-7.8 7.5-7.8 4.2.1 7.5 3 7.5 7.8zm-13.1 0c0 3.8 2.3 6.1 5.5 6.1 3.2 0 5.5-2.3 5.5-6.1s-2.3-6.1-5.5-6.1c-3.1-.1-5.5 2.2-5.5 6.1zM118 28.5v-11h1.8v1.8c.8-1.3 2-2 3.6-2 .3 0 .6 0 1 .1v1.8c-.3-.1-.7-.1-1-.1-2.1 0-3.4 1.3-3.4 3.7v5.8H118zM130.6 24.3h-7.6c.3 2.1 1.8 3 3.6 3 1.3 0 2.5-.5 3.3-1.3l1 1.1c-1 1.1-2.6 1.7-4.4 1.7-3.2 0-5.4-2.1-5.4-5.6 0-3.6 2-5.7 5-5.7 3.1 0 4.7 2.1 4.7 5.4v1.4zm-7.5-1.3h5.7c-.2-1.9-1.3-3-2.8-3-1.5 0-2.7 1-2.9 3z" fill="#fff"/>
      <path d="M19 8.2h-2.3V5h2.1c1.3 0 1.9.4 1.9 1.6S20.1 8.2 19 8.2zM21.5 6.5C21.5 4.8 20.3 4 18.5 4H15v5.1h3.3c1.9.1 3.2-.6 3.2-2.6zM24 9.1V4h.8v5.1H24zM26.3 9.1V4h.8v5.1h-.8zM29.5 9.1H28V4h1.5l1.6 3.6V4h.8v5.1h-1.2L29.5 5.9v3.2zM33.8 9.1V4h3.3v.7h-2.4V6h2.1v.7h-2.1v1.6h2.5v.7h-3.4zM41.6 5.8c0-1.1-.9-1.9-2.1-1.9-1.2 0-2.1.8-2.1 1.9 0 1.1.9 1.9 2.1 1.9 1.2 0 2.1-.8 2.1-1.9zm-3.3 0c0-.7.5-1.1 1.3-1.1s1.3.5 1.3 1.1c0 .7-.5 1.1-1.3 1.1s-1.3-.5-1.3-1.1zM47.1 9.1h-1l-1.3-3.6v3.6h-.8V4h1l1.5 3.9V4h.8v5.1z" fill="#fff"/>
    </svg>
  );
}

// Logo Google Play SVG Original
function GooglePlayBadge() {
  return (
    <svg viewBox="0 0 135 40" width="135" height="40" xmlns="http://www.w3.org/2000/svg">
      <path d="M130.2 0H4.8C2.1 0 0 2.1 0 4.8v30.3C0 37.9 2.1 40 4.8 40h125.3c2.7 0 4.8-2.1 4.8-4.8V4.8c.1-2.7-2-4.8-4.7-4.8z" fill="#000"/>
      <path d="M72.2 13.9c-3.1 0-5.7 2.4-5.7 5.7 0 3.3 2.5 5.7 5.7 5.7 3.1 0 5.7-2.4 5.7-5.7 0-3.3-2.5-5.7-5.7-5.7zm0 9.2c-1.8 0-3.4-1.4-3.4-3.5 0-2 1.6-3.5 3.4-3.5 1.8 0 3.4 1.4 3.4 3.5 0 2-1.6 3.5-3.4 3.5zM84.4 13.9c-3.1 0-5.7 2.4-5.7 5.7 0 3.3 2.5 5.7 5.7 5.7 3.1 0 5.7-2.4 5.7-5.7s-2.6-5.7-5.7-5.7zm0 9.2c-1.8 0-3.4-1.4-3.4-3.5 0-2 1.6-3.5 3.4-3.5 1.8 0 3.4 1.4 3.4 3.5 0 2-1.6 3.5-3.4 3.5zM60.6 16.4v2.3h5.4c-.2 1.2-1.3 3.6-5.4 3.6-3.3 0-6-2.7-6-6 0-3.3 2.7-6 6-6 1.8 0 3 .8 3.7 1.4l1.7-1.7C64.6 8.7 62.8 8 60.5 8c-4.6 0-8.3 3.7-8.3 8.3 0 4.6 3.7 8.3 8.3 8.3 4.8 0 8-3.4 8-8.1 0-.6-.1-1.1-.1-1.5l-7.8.1zM116.8 14.1c-1.7-2.2-4.1-3.6-6.4-3.6-3.1 0-5.7 2.5-5.7 5.7 0 3.3 2.5 5.7 5.6 5.7 2.5 0 4-1.3 4.9-2.6l-1.8-1.2c-.7.9-1.6 1.7-3.1 1.7-1.4 0-2.3-.6-2.9-1.9l7.9-3.3-.2-.5zm-9.8 1.9c0-2.1 1.6-3.5 3.1-3.5 1.2 0 2.2.6 2.6 1.5l-5.7 2zM122.9 25h2.3V8.4h-2.3V25zM100.9 16.1l-3.6 10.4h-2.4l-3.8-10.4V25h-2.2V8.4h2.4l3.5 9.7 3.4-9.7h2.4v16.6h-2.2v-8.9h2.5zM93.3 14h-1.9v8.9c0 1.2.9 2.2 2 2.2h.5l.3 1.9h-.9c-2.3 0-4-1.8-4-4.2V14h-1.5v-1.7h1.5v-2.7h2v2.7h1.9V14z" fill="#fff"/>
      <path d="M47.7 24.3l.5-.2 5.1-2.9-3.9-3.9-1.7 7z" fill="#EA4335"/>
      <path d="M49.6 20.3L37.1 27.2c-1.1.6-2.2.1-2.2-1V6c0-1.1 1.2-1.6 2.2-1l12.5 6.9-4.3 4.2 4.3 4.2z" fill="#FBBC04"/>
      <path d="M48.2 16.3l-5-2.9 1.7-1.6 3.3 4.5z" fill="#34A853"/>
      <path d="M48.2 16.3L53.3 19c1.6.9 1.6 2.4 0 3.3l-5.6 3.1-4.3-4.2 4.8-4.9z" fill="#4285F4"/>
      <path d="M22.2 6.5C22.2 4.8 21 4 19.1 4h-3.6v5.1h3.3c1.9.1 3.4-.6 3.4-2.6zM24.7 9.1V4h.8v5.1h-.8zM27 9.1V4h.8v5.1H27zM30.2 9.1H28.7V4h1.5l1.6 3.6V4h.8v5.1h-1.2L30.2 5.9v3.2zM34.5 9.1V4h3.3v.7H35.4V6h2.1v.7h-2.1v1.6h2.5v.7h-3.4zM42.3 5.8c0-1.1-.9-1.9-2.1-1.9-1.2 0-2.1.8-2.1 1.9 0 1.1.9 1.9 2.1 1.9 1.2 0 2.1-.8 2.1-1.9zm-3.3 0c0-.7.5-1.1 1.3-1.1s1.3.5 1.3 1.1c0 .7-.5 1.1-1.3 1.1s-1.3-.5-1.3-1.1zM47.8 9.1h-1l-1.3-3.6v3.6h-.8V4h1l1.5 3.9V4h.8v5.1zM19.7 8.2h-2.3V5h2.1c1.3 0 1.9.4 1.9 1.6s-.5 1.6-1.7 1.6z" fill="#fff"/>
    </svg>
  );
}

const shareUrl = "https://mi-colon-er.vercel.app/instalar";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=006F4B&margin=15`;

export default function PromoFlyerPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Contenedor del Flyer (Proporción vertical A4) */}
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-[#006F4B] to-[#004730] w-full max-w-2xl aspect-[3/4] sm:aspect-[4/5] md:aspect-auto md:h-[900px] shadow-2xl rounded-2xl flex flex-col items-center justify-between p-10 md:p-14 text-white"
        id="flyer-container"
      >
        {/* Adorno visual de fondo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#008F5B] rounded-full blur-[100px] opacity-40 pointer-events-none" />

        {/* Encabezado */}
        <div className="z-10 flex flex-col items-center mt-6 text-center">
          <div className="bg-white p-5 rounded-2xl shadow-xl mb-8">
            <NextImage
              src="/logo_colon.png"
              alt="Logo Mi Colón"
              width={220}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-4 tracking-tight leading-tight">
            La ciudad en tus manos
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 max-w-lg leading-relaxed font-medium">
            Plataforma integral de servicios y profesionales para Colón y la región.
          </p>
          <div className="mt-8 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <p className="text-lg text-white font-semibold">
              🛠️ Encontrá lo que necesitás, conectá con el talento local.
            </p>
          </div>
        </div>

        {/* Sección Inferior (QR + Botones) */}
        <div className="z-10 w-full bg-white text-gray-900 rounded-3xl p-8 md:p-10 shadow-2xl mt-12 flex flex-col items-center border-t-8 border-amber-500">
          <h2 className="text-2xl font-bold mb-2 text-center text-[#006F4B]">¡Instalá la App gratis!</h2>
          <p className="text-gray-500 mb-8 text-center">Disponible para todas las plataformas.</p>
          
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 w-full justify-center">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div className="p-2 border-2 border-dashed border-gray-300 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={QR_URL} 
                  alt="Código QR para descargar app" 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-xl object-contain"
                  crossOrigin="anonymous" 
                />
              </div>
              <p className="text-sm font-bold text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">
                Escaneá con tu cámara
              </p>
            </div>

            {/* Badges de Tiendas */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1 items-center md:items-start">
                <p className="text-sm font-semibold text-gray-500 mb-1">Android (Google Play)</p>
                <GooglePlayBadge />
              </div>
              <div className="flex flex-col gap-1 items-center md:items-start">
                <p className="text-sm font-semibold text-gray-500 mb-1">iOS (Apple App Store)</p>
                <AppStoreBadge />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center md:text-left max-w-[200px]">
                O ingresá desde el navegador a: <br/>
                <span className="font-bold text-[#006F4B]">mi-colon-er.vercel.app/instalar</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
