"use client";

import { Check, Circle, X } from "lucide-react";
import type { CategoryGroup } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type NamedOption = {
  slug: string;
  name: string;
};

type ServiceDraft = {
  areaSlug: string;
  categoryId: string;
  title: string;
  description: string;
};

interface ServiceSelectionCardProps {
  group: CategoryGroup;
  index: number;
  service: ServiceDraft;
  areas: NamedOption[];
  categoryOptions: NamedOption[];
  selectedAreaName?: string;
  selectedServiceName?: string;
  categoriesLoading: boolean;
  areaError?: string;
  categoryError?: string;
  descriptionError?: string;
  canRemove?: boolean;
  onAreaChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRemove?: () => void;
}

export function ServiceSelectionCard({
  group,
  index,
  service,
  areas,
  categoryOptions,
  selectedAreaName,
  selectedServiceName,
  categoriesLoading,
  areaError,
  categoryError,
  descriptionError,
  canRemove = false,
  onAreaChange,
  onCategoryChange,
  onDescriptionChange,
  onRemove,
}: ServiceSelectionCardProps) {
  const isProfession = group === "profesiones";
  const waitingForArea = !isProfession && !service.areaSlug;
  const usesParentArea = !isProfession && !!service.areaSlug && categoryOptions.length === 0;
  const resolvedServiceName = selectedServiceName || (usesParentArea ? selectedAreaName || "" : "");
  const serviceOptions = usesParentArea
    ? selectedAreaName
      ? [{ slug: service.categoryId || service.areaSlug, name: selectedAreaName, selected: true }]
      : []
    : categoryOptions.map((option) => ({
        slug: option.slug,
        name: option.name,
        selected: service.categoryId === option.slug,
      }));

  const renderOptionGrid = (
    options: Array<{ slug: string; name: string; selected: boolean }>,
    onSelect: (slug: string) => void,
    columnsClassName = "sm:grid-cols-2"
  ) => (
    <div className={`grid gap-2 ${columnsClassName}`}>
      {options.map((option) => (
        <button
          key={option.slug}
          type="button"
          onClick={() => onSelect(option.slug)}
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
            option.selected
              ? "border-[#006F4B] bg-[#006F4B] text-white shadow-sm"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-[#006F4B]/40 hover:bg-[#006F4B]/[0.04] dark:hover:bg-gray-700"
          }`}
        >
          <span className="text-sm font-medium leading-snug">{option.name}</span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
              option.selected ? "border-white/40 bg-white/10" : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            }`}
          >
            {option.selected ? (
              <Check className="h-3.5 w-3.5 text-white" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-gray-300 dark:text-gray-500" />
            )}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#006F4B] dark:text-emerald-400">
              {isProfession ? "Perfil profesional" : `Servicio ${index + 1}`}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {isProfession ? "Elegi tu profesion" : "Elegi el servicio que queres publicar"}
            </h3>
          </div>
          {canRemove && onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="shrink-0 rounded-full px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
            >
              <X className="mr-1 h-4 w-4" />
              Quitar
            </Button>
          ) : null}
        </div>

        {!isProfession ? (
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Area principal</Label>
            {categoriesLoading ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                Cargando areas...
              </div>
            ) : (
              <Select value={service.areaSlug} onValueChange={onAreaChange}>
                <SelectTrigger
                  className={`min-h-12 rounded-2xl border-2 bg-white dark:bg-gray-800 dark:text-white transition-all duration-200 focus:border-[#006F4B] focus:ring-4 focus:ring-green-100 dark:focus:ring-emerald-950 ${
                    areaError ? "border-red-300" : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <SelectValue placeholder="Selecciona un area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.slug} value={area.slug}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {areaError ? <p className="text-sm text-red-600 dark:text-red-400">{areaError}</p> : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {isProfession ? "Profesiones disponibles" : "Servicios disponibles"}
            </Label>
          </div>

          {categoriesLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
              Cargando categorias...
            </div>
          ) : waitingForArea ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
              Selecciona un area.
            </div>
          ) : (
            renderOptionGrid(serviceOptions, onCategoryChange)
          )}

          {categoryError ? <p className="text-sm text-red-600 dark:text-red-400">{categoryError}</p> : null}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#006F4B] dark:text-emerald-400">
            Seleccion actual
          </p>
          <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
            {resolvedServiceName ||
              (isProfession
                ? "Todavia no elegiste una profesion."
                : "Todavia no elegiste un servicio para esta tarjeta.")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Descripcion</Label>
          <Textarea
            value={service.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            className={`mt-2 min-h-[104px] resize-none rounded-2xl border-2 bg-white dark:bg-gray-900 dark:text-white transition-all duration-200 focus:border-[#006F4B] focus:ring-4 focus:ring-green-100 dark:focus:ring-emerald-950 ${
              descriptionError ? "border-red-300" : "border-gray-200 dark:border-gray-700"
            }`}
            placeholder={
              isProfession
                ? "Contanos tu formacion, matricula si aplica y el tipo de consultas o trabajos que realizas."
                : "Describe con claridad que incluye este servicio, que tipo de trabajos haces y cualquier detalle util."
            }
          />
          {descriptionError ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{descriptionError}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
