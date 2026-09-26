"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Menu, User, X, LogOut, LayoutDashboard, ChevronDown, Settings, ShieldCheck } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { SearchSuggestions } from "@/components/features/SearchSuggestions";
import { useAuth } from "@/hooks/useAuth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { user, logout, profile } = useAuth();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirigir a la página de servicios con la búsqueda
      window.location.href = `/servicios?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 overflow-visible bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center overflow-visible">
          {/* Logo y marca */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <NextImage src="/logo_colon.png" alt="Logo Mi Colón" className="h-12 w-auto flex-shrink-0 object-contain" width={120} height={50} priority />
              <div className="leading-tight">
                <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
                  Mi Colón
                </h1>
                <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                  Colón, Entre Ríos
                </p>
              </div>
            </Link>
          </div>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden md:flex relative w-80 flex-none overflow-visible">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="text-lg" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                placeholder="Buscar servicios..."
                className="pl-10 pr-14 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white w-80 transition-all"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-emerald-800"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="absolute left-0 right-0 top-full z-[60] mt-2">
                <SearchSuggestions
                  query={searchQuery}
                  isVisible={showSuggestions}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
            </form>
          </div>

          {/* Navegación */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Botón de alternar modo nocturno / claro */}
            <ThemeToggle />

            {/* Botón de búsqueda móvil */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Desktop: Menú de usuario */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer outline-none">
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                    {(user.firstName || user.name || 'Usuario').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-semibold">Hola, {user.firstName || user.name || 'Usuario'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal border-b border-gray-100 dark:border-gray-800 pb-2 mb-1">
                    <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {user.firstName || user.name || 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  {(user.role === 'admin' || user.email === 'admin@micolon.com') && (
                    <DropdownMenuItem onClick={() => {
                      window.location.href = '/dashboard/admin';
                    }} className="font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 focus:bg-emerald-100 dark:focus:bg-emerald-900/60 cursor-pointer">
                      <ShieldCheck className="h-4 w-4 mr-2 text-emerald-700 dark:text-emerald-400" />
                      Panel de Administración
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={async () => {
                    const profileData = await profile();
                    if (profileData) {
                      window.location.href = `/profesionales/${profileData.id}`;
                    }
                  }} className="cursor-pointer text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-gray-800">
                    <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    window.location.href = '/dashboard';
                  }} className="cursor-pointer text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-gray-800">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Mi dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    window.location.href = '/dashboard/settings';
                  }} className="cursor-pointer text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-gray-800">
                    <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Ajustes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 font-medium">
                    <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                    Salir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                  <Link href="/auth/login">
                    <User className="h-4 w-4 mr-1" />
                    Ingresar
                  </Link>
                </Button>
                <Button size="sm" asChild className="hidden md:flex bg-amber-600 hover:bg-amber-700 text-white">
                  <Link href="/auth/registro">
                    Ofrecer Servicios
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile: Avatar del usuario (si está logueado) */}
            {user && (
              <div className="md:hidden">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                  {(user.firstName || user.name || 'Usuario').charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Menú hamburguesa móvil */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda móvil (toggleable) */}
      {showMobileSearch && (
        <div className="md:hidden overflow-visible border-t p-4 bg-white dark:bg-gray-900">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              placeholder="Buscar servicios..."
              className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-12 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
              autoFocus
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-emerald-800"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="absolute left-0 right-0 top-full z-[60] mt-2">
              <SearchSuggestions
                query={searchQuery}
                isVisible={showSuggestions}
                onSelect={handleSuggestionSelect}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
          </form>
        </div>
      )}

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                {/* Información del usuario */}
                <div className="flex items-center gap-3 px-3 py-2 mb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                    {(user.firstName || user.name || 'Usuario').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {user.firstName || user.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Opciones del menú */}
                {(user.role === 'admin' || user.email === 'admin@micolon.com') && (
                  <button
                    onClick={() => {
                      window.location.href = '/dashboard/admin';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-md transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    Panel de Administración
                  </button>
                )}
                <button
                  onClick={async () => {
                    const profileData = await profile();
                    if (profileData) {
                      window.location.href = `/profesionales/${profileData.id}`;
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Mi perfil
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/dashboard';
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Mi dashboard
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/dashboard/settings';
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Ajustes
                </button>
                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Ingresar
                </Link>
                <Link
                  href="/auth/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 rounded-md transition-colors"
                >
                  Ofrecer Servicios
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
