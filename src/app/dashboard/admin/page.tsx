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
  MessageSquare,
  Lightbulb,
  Tag,
  AlertCircle,
  Calendar,
  Send,
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

type BugReportItem = {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
  userEmail: string;
  context: {
    name?: string;
    origin?: string;
    url?: string;
    topic?: string;
  } | null;
  createdAt: string;
};

type CategorySuggestionItem = {
  id: string;
  title: string;
  description: string | null;
  status: "open" | "in_review" | "approved" | "rejected";
  userEmail: string | null;
  origin: string | null;
  url: string | null;
  perspective: "provider" | "seeker" | null;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "suspended" | "all" | "support">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Soporte y Mensajes
  const [bugReports, setBugReports] = useState<BugReportItem[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<CategorySuggestionItem[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [updatingSupportId, setUpdatingSupportId] = useState<string | null>(null);
  const [supportSection, setSupportSection] = useState<"messages" | "suggestions">("messages");

  // Redirigir si no es autenticado
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

  const fetchSupport = useCallback(async () => {
    setSupportLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      const json = await res.json();
      if (json.success && json.data) {
        setBugReports(json.data.bugReports || []);
        setCategorySuggestions(json.data.categorySuggestions || []);
      } else {
        toast.error("Error al cargar mensajes de soporte");
      }
    } catch (err) {
      console.error("Error fetching support:", err);
      toast.error("Error al obtener los mensajes de soporte");
    } finally {
      setSupportLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchProfessionals();
      fetchSupport();
    }
  }, [authStatus, fetchProfessionals, fetchSupport]);

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

  const handleUpdateSupportStatus = async (
    type: "contact" | "suggestion",
    id: string,
    newStatus: string
  ) => {
    setUpdatingSupportId(id);
    try {
      const res = await fetch("/api/admin/support", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Estado actualizado correctamente");
        if (type === "contact") {
          setBugReports((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
          );
        } else {
          setCategorySuggestions((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
          );
        }
      } else {
        toast.error(json.message || "Error al actualizar estado");
      }
    } catch (err) {
      console.error("Error updating support status:", err);
      toast.error("Error de red al actualizar el mensaje");
    } finally {
      setUpdatingSupportId(null);
    }
  };

  // Filtrado de profesionales
  const filteredProfessionals = professionals.filter((p) => {
    const matchesTab = activeTab === "all" ? true : p.status === activeTab;
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

  // Filtrado de soporte
  const openMessagesCount = bugReports.filter((r) => r.status === "open" || r.status === "in_progress").length;
  const pendingSuggestionsCount = categorySuggestions.filter((s) => s.status === "open" || s.status === "in_review").length;
  const totalSupportCount = openMessagesCount + pendingSuggestionsCount;

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
            <div className="flex items-center gap-2 text-[#006F4B] dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">
              <ShieldCheck className="h-5 w-5" />
              Panel de Administración
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-rutan">
              {activeTab === "support" ? "Mensajes & Sugerencias de Usuarios" : "Aprobación de Profesionales"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {activeTab === "support"
                ? "Gestión de mensajes enviados desde el formulario de contacto y propuestas de categorías."
                : "Revisá, aprobá o suspendé los perfiles de vecinos profesionales de Colón."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                fetchProfessionals();
                fetchSupport();
              }}
              variant="outline"
              className="flex items-center gap-2 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${loading || supportLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card
            onClick={() => setActiveTab("pending")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "pending"
                ? "border-amber-500 shadow-md ring-2 ring-amber-500/20"
                : "border-gray-100 dark:border-gray-800 hover:border-amber-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Pendientes
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Esperando aprobación</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("active")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "active"
                ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "border-gray-100 dark:border-gray-800 hover:border-emerald-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Activos
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visibles públicamente</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("suspended")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "suspended"
                ? "border-red-500 shadow-md ring-2 ring-red-500/20"
                : "border-gray-100 dark:border-gray-800 hover:border-red-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
                Suspendidos
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{suspendedCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ocultos de la búsqueda</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "all"
                ? "border-[#006F4B] shadow-md ring-2 ring-[#006F4B]/20"
                : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Registrados
              </CardTitle>
              <UserCheck className="h-5 w-5 text-[#006F4B] dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {professionals.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Todos los perfiles</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setActiveTab("support")}
            className={`cursor-pointer transition-all rounded-2xl border ${
              activeTab === "support"
                ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                : "border-gray-100 dark:border-gray-800 hover:border-blue-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Mensajes & Soporte
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalSupportCount}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Consultas y sugerencias</p>
            </CardContent>
          </Card>
        </div>

        {/* Buscador y Pestañas principales */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Button
              variant={activeTab === "pending" ? "default" : "ghost"}
              onClick={() => setActiveTab("pending")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "pending"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "dark:text-gray-300"
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
                  : "dark:text-gray-300"
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
                  : "dark:text-gray-300"
              }`}
            >
              🚫 Suspendidos ({suspendedCount})
            </Button>
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "all"
                  ? "bg-gray-800 text-white dark:bg-gray-700"
                  : "dark:text-gray-300"
              }`}
            >
              Todos ({professionals.length})
            </Button>
            <Button
              variant={activeTab === "support" ? "default" : "ghost"}
              onClick={() => setActiveTab("support")}
              className={`rounded-xl text-sm font-semibold ${
                activeTab === "support"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "dark:text-gray-300"
              }`}
            >
              📩 Mensajes & Soporte ({totalSupportCount})
            </Button>
          </div>

          {activeTab !== "support" && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* TAB MENSAJES & SOPORTE */}
        {activeTab === "support" ? (
          <div className="space-y-6">
            {/* Sub-navegación: Mensajes de contacto vs Sugerencias de categorías */}
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
              <Button
                variant={supportSection === "messages" ? "default" : "outline"}
                onClick={() => setSupportSection("messages")}
                className={`rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  supportSection === "messages"
                    ? "bg-[#006F4B] text-white"
                    : "dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Mensajes de Contacto ({bugReports.length})
              </Button>
              <Button
                variant={supportSection === "suggestions" ? "default" : "outline"}
                onClick={() => setSupportSection("suggestions")}
                className={`rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  supportSection === "suggestions"
                    ? "bg-[#006F4B] text-white"
                    : "dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                Sugerencias de Categorías ({categorySuggestions.length})
              </Button>
            </div>

            {supportLoading ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#006F4B] mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Cargando mensajes de soporte...</p>
              </div>
            ) : supportSection === "messages" ? (
              /* MENSAJES DE CONTACTO / SOPORTE */
              bugReports.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    No hay mensajes de contacto registrados
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Los mensajes enviados desde la página de contacto aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bugReports.map((report) => (
                    <Card
                      key={report.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all overflow-hidden"
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  report.status === "open"
                                    ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                                    : report.status === "in_progress"
                                    ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300"
                                    : report.status === "resolved"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                }
                              >
                                {report.status === "open"
                                  ? "Abierto"
                                  : report.status === "in_progress"
                                  ? "En revisión"
                                  : report.status === "resolved"
                                  ? "Resuelto"
                                  : "Cerrado"}
                              </Badge>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(report.createdAt).toLocaleString("es-AR")}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                              {report.title}
                            </h3>
                          </div>

                          {/* Cambiar estado */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Estado:</span>
                            <select
                              value={report.status}
                              disabled={updatingSupportId === report.id}
                              onChange={(e) => handleUpdateSupportStatus("contact", report.id, e.target.value)}
                              className="text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1.5 focus:ring-2 focus:ring-[#006F4B]"
                            >
                              <option value="open">Abierto</option>
                              <option value="in_progress">En revisión</option>
                              <option value="resolved">Resuelto</option>
                              <option value="closed">Cerrado</option>
                            </select>
                          </div>
                        </div>

                        {/* Remitente e información */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 text-[#006F4B] dark:text-emerald-400 shrink-0" />
                            <span className="font-semibold">Remitente:</span>
                            <a href={`mailto:${report.userEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                              {report.context?.name ? `${report.context.name} (${report.userEmail})` : report.userEmail}
                            </a>
                          </div>
                          {report.context?.url && (
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <ExternalLink className="h-4 w-4 text-[#006F4B] dark:text-emerald-400 shrink-0" />
                              <span className="font-semibold">Página:</span>
                              <a href={report.context.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                                {report.context.url}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Contenido del mensaje */}
                        <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Mensaje:</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              /* SUGERENCIAS DE CATEGORÍAS */
              categorySuggestions.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    No hay sugerencias de categorías registradas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Las sugerencias enviadas por los usuarios aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySuggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all overflow-hidden"
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  suggestion.status === "open"
                                    ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                                    : suggestion.status === "in_review"
                                    ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300"
                                    : suggestion.status === "approved"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    : "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300"
                                }
                              >
                                {suggestion.status === "open"
                                  ? "Pendiente"
                                  : suggestion.status === "in_review"
                                  ? "En revisión"
                                  : suggestion.status === "approved"
                                  ? "Aprobada"
                                  : "Rechazada"}
                              </Badge>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(suggestion.createdAt).toLocaleString("es-AR")}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                              <Tag className="h-4 w-4 text-[#006F4B] dark:text-emerald-400" />
                              {suggestion.title}
                            </h3>
                          </div>

                          {/* Cambiar estado */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Estado:</span>
                            <select
                              value={suggestion.status}
                              disabled={updatingSupportId === suggestion.id}
                              onChange={(e) => handleUpdateSupportStatus("suggestion", suggestion.id, e.target.value)}
                              className="text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1.5 focus:ring-2 focus:ring-[#006F4B]"
                            >
                              <option value="open">Pendiente</option>
                              <option value="in_review">En revisión</option>
                              <option value="approved">Aprobada</option>
                              <option value="rejected">Rechazada</option>
                            </select>
                          </div>
                        </div>

                        {/* Remitente e información */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 text-[#006F4B] dark:text-emerald-400 shrink-0" />
                            <span className="font-semibold">Remitente:</span>
                            {suggestion.userEmail ? (
                              <a href={`mailto:${suggestion.userEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                {suggestion.userEmail}
                              </a>
                            ) : (
                              <span className="text-gray-500">Anónimo</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Briefcase className="h-4 w-4 text-[#006F4B] dark:text-emerald-400 shrink-0" />
                            <span className="font-semibold">Perfil:</span>
                            <span>
                              {suggestion.perspective === "provider"
                                ? "Ofrece el servicio (Profesional)"
                                : suggestion.perspective === "seeker"
                                ? "Busca el servicio (Vecino)"
                                : "General"}
                            </span>
                          </div>
                        </div>

                        {/* Detalles */}
                        {suggestion.description && (
                          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Detalles / Justificación:</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                              {suggestion.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          /* TAB DE PROFESIONALES (PENDIENTES, ACTIVOS, SUSPENDIDOS, TODOS) */
          loading ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#006F4B] mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Cargando perfiles...</p>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeTab === "pending"
                  ? "¡No hay perfiles pendientes por aprobar!"
                  : "No se encontraron profesionales con estos filtros."}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Info del Profesional */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          {prof.ProfilePicture ? (
                            <Image
                              src={resolvePublicUploadUrl(prof.ProfilePicture)}
                              alt={prof.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold bg-gray-100 dark:bg-gray-800">
                              {prof.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {prof.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                prof.status === "pending"
                                  ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                                  : prof.status === "active"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300"
                              }
                            >
                              {prof.status === "pending"
                                ? "⏳ Pendiente"
                                : prof.status === "active"
                                ? "✅ Aprobado"
                                : "🚫 Suspendido"}
                            </Badge>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {prof.professionalGroup}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap pt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {prof.email}
                            </span>
                            {prof.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {prof.phone}
                              </span>
                            )}
                            {prof.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {prof.location}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 pt-2">
                            {prof.bio || "Sin biografía especificada."}
                          </p>

                          {prof.services && prof.services.length > 0 && (
                            <div className="flex items-center gap-2 pt-2 flex-wrap">
                              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">Servicios:</span>
                              {prof.services.map((s) => (
                                <Badge key={s.id} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                                  {s.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-end gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800">
                        <Link
                          href={`/profesionales/${prof.id}`}
                          target="_blank"
                          className="w-full lg:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl text-xs flex items-center gap-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver Perfil Público
                          </Button>
                        </Link>

                        {prof.status === "pending" && (
                          <div className="flex items-center gap-2 w-full lg:w-auto">
                            <Button
                              onClick={() => handleUpdateStatus(prof.id, "active", true)}
                              disabled={updatingId === prof.id}
                              className="bg-[#006F4B] hover:bg-[#005a3d] text-white rounded-xl text-xs font-semibold flex-1 lg:flex-none"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Aprobar y Verificar
                            </Button>
                            <Button
                              onClick={() => handleUpdateStatus(prof.id, "suspended", false)}
                              disabled={updatingId === prof.id}
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 rounded-xl text-xs flex-1 lg:flex-none"
                            >
                              Rechazar
                            </Button>
                          </div>
                        )}

                        {prof.status === "active" && (
                          <Button
                            onClick={() => handleUpdateStatus(prof.id, "suspended", false)}
                            disabled={updatingId === prof.id}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 rounded-xl text-xs w-full lg:w-auto"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Suspender Perfil
                          </Button>
                        )}

                        {prof.status === "suspended" && (
                          <Button
                            onClick={() => handleUpdateStatus(prof.id, "active", true)}
                            disabled={updatingId === prof.id}
                            className="bg-[#006F4B] hover:bg-[#005a3d] text-white rounded-xl text-xs font-semibold w-full lg:w-auto"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Reactivar Perfil
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
