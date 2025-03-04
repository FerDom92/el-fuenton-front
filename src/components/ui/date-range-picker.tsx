// src/components/ui/date-range-picker.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onFromChange: (date: Date) => void;
  onToChange: (date: Date) => void;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangePickerProps) {
  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy", { locale: es });
  };

  return (
    <div className="flex flex-row space-x-4 items-start justify-center">
      <div className="bg-background p-4 rounded-lg">
        <div className="flex gap-4">
          <span className="text-sm font-medium mb-2">Fecha Inicio</span>
          <span className="text-sm text-muted-foreground mb-4">
            {formatDate(from)}
          </span>
        </div>
        <Calendar
          mode="single"
          selected={from}
          onSelect={(date) => date && onFromChange(date)}
          locale={es}
          className="border rounded-md"
          disabled={(date) => date > to || date > new Date()}
        />
      </div>

      <Separator orientation="vertical" className="h-auto" />

      <div className="bg-background p-4 rounded-lg">
        <div className="flex gap-4">
          <span className="text-sm font-medium mb-2">Fecha Fin</span>
          <span className="text-sm text-muted-foreground mb-4">
            {formatDate(to)}
          </span>
        </div>
        <Calendar
          mode="single"
          selected={to}
          onSelect={(date) => date && onToChange(date)}
          locale={es}
          className="border rounded-md"
          disabled={(date) => date < from || date > new Date()}
        />
      </div>
    </div>
  );
}
