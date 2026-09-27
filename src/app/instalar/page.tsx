"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";

type Platform = "android" | "ios" | "desktop" | "installed" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Logo oficial de Android (SVG inline)
function AndroidLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.523 15.341a.908.908 0 0 1-.908-.908.908.908 0 0 1 .908-.908.908.908 0 0 1 .908.908.908.908 0 0 1-.908.908m-11.046 0a.908.908 0 0 1-.908-.908.908.908 0 0 1 .908-.908.908.908 0 0 1 .908.908.908.908 0 0 1-.908.908M17.78 10.18l1.826-3.164a.38.38 0 0 0-.139-.519.38.38 0 0 0-.519.138l-1.85 3.205A11.13 11.13 0 0 0 12 9a11.13 11.13 0 0 0-5.098 1.84L5.052 7.635a.38.38 0 0 0-.519-.138.38.38 0 0 0-.138.519L6.22 11.18C3.592 12.793 1.853 15.538 1.5 18.75h21c-.353-3.212-2.092-5.957-4.72-7.57"
        fill="#3DDC84"
      />
    </svg>
  );
}

const shareUrl = "https://mi-colon-er.vercel.app/instalar";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=0f172a&margin=12`;

export default function InstalarPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setPlatform("installed");
      setInstalled(true);
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");
    else setPlatform("desktop");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
      setPlatform("installed");
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Mi Colón - Instalar App",
        text: "Instalá Mi Colón en tu celular gratis, sin pasar por la tienda.",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("¡Link copiado al portapapeles!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 py-10">
      {/* Logo y título */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <NextImage
          src="/logo_colon.png"
          alt="Logo Mi Colón"
          width={160}
          height={70}
          className="object-contain"
          priority
        />
        <h1 className="text-2xl font-bold text-foreground text-center">
          Instalá Mi Colón en tu celular
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Sin pasar por la tienda. Funciona en Android e iOS, gratis y en segundos.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">

        {/* ✅ Ya instalada */}
        {platform === "installed" && (
          <div className="rounded-2xl bg-emerald-900/30 border border-emerald-700 p-6 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <h2 className="text-lg font-bold text-emerald-400">¡Ya tenés la app instalada!</h2>
            <p className="text-sm text-gray-400">
              Mi Colón ya está en tu pantalla de inicio. Podés usarla sin abrir el navegador.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ir a Mi Colón
            </Link>
          </div>
        )}

        {/* Android - Chrome con prompt disponible */}
        {platform === "android" && deferredPrompt && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AndroidLogo size={40} />
              <div>
                <h2 className="font-bold text-foreground">Android detectado</h2>
                <p className="text-xs text-muted-foreground">Chrome listo para instalar</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Tocá el botón para agregar <strong>Mi Colón</strong> directamente a tu pantalla de inicio.
            </p>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
            >
              {installing ? "Instalando..." : "⬇️ Instalar Mi Colón ahora"}
            </button>
          </div>
        )}

        {/* Android - sin prompt (deben abrir en Chrome) */}
        {platform === "android" && !deferredPrompt && !installed && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AndroidLogo size={40} />
              <div>
                <h2 className="font-bold text-foreground">Android detectado</h2>
                <p className="text-xs text-muted-foreground">Seguí estos pasos en Chrome</p>
              </div>
            </div>
            <ol className="space-y-3 text-sm text-muted-foreground list-none">
              {[
                { n: "1", text: "Abrí esta página en el navegador Chrome de tu celular." },
                { n: "2", text: "Tocá los 3 puntitos ⋮ en la esquina superior derecha." },
                { n: "3", text: 'Seleccioná "Agregar a pantalla de inicio" o "Instalar app".' },
                { n: "4", text: 'Confirmá tocando "Agregar" o "Instalar".' },
              ].map((step) => (
                <li key={step.n} className="flex gap-3 items-start">
                  <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    {step.n}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* iOS */}
        {platform === "ios" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🍎</span>
              <div>
                <h2 className="font-bold text-foreground">iPhone o iPad detectado</h2>
                <p className="text-xs text-muted-foreground">Usá Safari para instalar</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              En iOS la instalación se hace desde <strong>Safari</strong>:
            </p>
            <ol className="space-y-3 text-sm text-muted-foreground list-none">
              {[
                { n: "1", text: "Abrí esta página en Safari (no Chrome ni otro navegador)." },
                { n: "2", text: "Tocá el ícono de compartir en la barra inferior (cuadrado con flecha ↑)." },
                { n: "3", text: 'Desplazate y tocá "Agregar a pantalla de inicio".' },
                { n: "4", text: 'Confirmá tocando "Agregar" arriba a la derecha.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-3 items-start">
                  <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    {step.n}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Desktop - QR */}
        {platform === "desktop" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💻</span>
              <div>
                <h2 className="font-bold text-foreground">Escaneá con tu celular</h2>
                <p className="text-xs text-muted-foreground">Apuntá la cámara al código QR</p>
              </div>
            </div>
            {/* QR usando api.qrserver.com - más confiable */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QR_URL}
              alt="Código QR para instalar Mi Colón"
              width={200}
              height={200}
              className="mx-auto rounded-xl border border-border"
            />
            <p className="text-xs text-center text-muted-foreground break-all">{shareUrl}</p>
          </div>
        )}

        {/* Botón compartir */}
        {platform !== "installed" && (
          <button
            onClick={handleShare}
            className="w-full border border-border text-foreground hover:bg-muted font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            📤 Compartir link de instalación
          </button>
        )}

      </div>
    </div>
  );
}
