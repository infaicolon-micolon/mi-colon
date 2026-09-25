"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ShieldCheck,
  UserCheck,
  Briefcase,
  ExternalLink,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { resolvePublicUploadUrl } from "@/lib/public-upload-url";

type Professional = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string;
  status: "active" | "pending" | "suspended";
  verified: boolean;
  professionalGroup: string;
  experienceYears: number | null;
  location: string | null;
  ProfilePicture: string | null;
  createdAt: string;
  services: Array<{ id: string; title: string; category: string }>;
};

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "suspended" | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Redirigir si no es admin
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [authStatus, router]);

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/professionals?limit=100");
      const json = await res.json();
      if (json.success && json.data) {
        setProfessionals(json.data);
      } else {
        toast.error("Error al cargar profesionales");
      }
    } catch (err) {
      console.error("Error fetching professionals:", err);
      toast.error("Error de conexión al cargar el panel de administración");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchProfessionals();
    }
  }, [authStatus, fetchProfessionals]);

  const handleUpdateStatus = async (id: string, newStatus: "active" | "suspended", verified: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/professionals/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, verified }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(
          newStatus === "active"
            ? "¡Perfil APROBADO y AVISADO públicamente!"
            : "Perfil suspendido"
        );
        // Actualizar lista local
        setProfessionals((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus, verified } : p
          )
        );
      } else {
        toast.error(json.message || "Error al actualizar estado");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error de red al actualizar estado");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado
  const filteredProfessionals = professionals.filter((p) => {
    const matchesTab =
      activeTab === "all" ? true : p.status === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm)) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = professionals.filter((p) => p.status === "pending").length;
  const activeCount = professionals.filter((p) => p.status === "active").length;
  const suspendedCount = professionals.filter((p) => p.status === "suspended").length;

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-[#006F4B]" />
          <span className="font-semibold text-gray-700">Cargando Panel de Administración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-[#006F4B] font-bold text-sm uppercase tracking-wider mb-1">
              <ShieldCheck className="h-5 w-5" />
              Panel de Administración
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-rutan">
              Aprobación de Profesionales
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Revisá, aprobá o suspendé los perfiles de vecinos profesionales de Colón.
            </p>
          </div>

          <Button
            onClick={fetchProfessionals}
            variant="outline"
            className="flex items-center gap-2 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar lista
          </Button>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            onClick={() => setActiveTab("pending")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "pending"
                ? "border-amber-500 shadow-md ring-2 ring-amber-500/20"
                : "border-gray-100 hover:border-amber-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Pendientes de Revisión
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-xs text-gray-500 mt-1">Esperando aprobación</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("active")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "active"
                ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "border-gray-100 hover:border-emerald-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Aprobados y Activos
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{activeCount}</div>
              <p className="text-xs text-gray-500 mt-1">Visibles públicamente</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("suspended")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "suspended"
                ? "border-red-500 shadow-md ring-2 ring-red-500/20"
                : "border-gray-100 hover:border-red-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
                Suspendidos
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{suspendedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Ocultos de la búsqueda</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "all"
                ? "border-[#006F4B] shadow-md ring-2 ring-[#006F4B]/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Registrados
              </CardTitle>
              <UserCheck className="h-5 w-5 text-[#006F4B]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {professionals.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Todos los perfiles</p>
            </CardContent>
          </Card>
        </div>

        {/* Buscador y Pestañas */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Button
              variant={activeTab === "pending" ? "default" : "ghost"}
              onClick={() => setActiveTab("pending")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "pending"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : ""
              }`}
            >
              ⏳ Pendientes ({pendingCount})
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "ghost"}
              onClick={() => setActiveTab("active")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "active"
                  ? "bg-[#006F4B] hover:bg-[#008F5B] text-white"
                  : ""
              }`}
            >
              ✅ Aprobados ({activeCount})
            </Button>
            <Button
              variant={activeTab === "suspended" ? "default" : "ghost"}
              onClick={() => setActiveTab("suspended")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "suspended"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }`}
            >
              🚫 Suspendidos ({suspendedCount})
            </Button>
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className="rounded-xl text-sm font-semibold"
            >
              Todos ({professionals.length})
            </Button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-gray-200"
            />
          </div>
        </div>

        {/* Lista de Profesionales */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#006F4B] mb-3" />
            <p className="text-gray-500">Cargando perfiles...</p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {activeTab === "pending"
                ? "¡No hay perfiles pendientes por aprobar!"
                : "No se encontraron profesionales con estos filtros."}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "pending"
                ? "Todos los vecinos profesionales registrados están aprobados y activos."
                : "Prueba cambiar el término de búsqueda o pestaña."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProfessionals.map((prof) => (
              <Card
                key={prof.id}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Info del Profesional */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                        {prof.ProfilePicture ? (
                          <Image
                            src={resolvePublicUploadUrl(prof.ProfilePicture)}
                            alt={prof.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#006F4B]/10 text-[#006F4B] font-bold text-xl">
                            {prof.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {prof.name}
                          </h3>

                          {prof.status === "pending" && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              ⏳ Pendiente de Aprobación
                            </Badge>
                          )}
                          {prof.status === "active" && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              ✅ Aprobado y Visible
                            </Badge>
                          )}
                          {prof.status === "suspended" && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              🚫 Suspendido
                            </Badge>
                          )}

                          {prof.verified && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Verificado
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap pt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {prof.email}
                          </span>
                          {prof.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {prof.phone}
                            </span>
                          )}
                          {prof.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {prof.location}
                            </span>
                          )}
                          {prof.experienceYears !== null && (
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-gray-400" />
                              {prof.experienceYears} años de experiencia
                            </span>
                          )}
                        </div>

                        {/* Bio */}
                        {prof.bio && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 pt-2">
                            &quot;{prof.bio}&quot;
                          </p>
                        )}

                        {/* Servicios */}
                        {prof.services && prof.services.length > 0 && (
                          <div className="flex items-center gap-2 pt-2 flex-wrap">
                            <span className="text-xs font-semibold text-gray-500">
                              Servicios:
                            </span>
                            {prof.services.map((s) => (
                              <Badge key={s.id} variant="secondary" className="text-xs">
                                {s.title || s.category}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <Link href={`/profesionales/${prof.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Ver Perfil
                        </Button>
                      </Link>

                      {prof.status !== "active" && (
                        <Button
                          onClick={() => handleUpdateStatus(prof.id, "active", true)}
                          disabled={updatingId === prof.id}
                          className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] hover:from-[#008F5B] hover:to-[#006F4B] text-white font-bold rounded-xl shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Aprobar Perfil
                        </Button>
                      )}

                      {prof.status === "active" && (
                        <Button
                          onClick={() => handleUpdateStatus(prof.id, "suspended", false)}
                          disabled={updatingId === prof.id}
                          variant="destructive"
                          size="sm"
                          className="rounded-xl flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Suspender
                        </Button>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
