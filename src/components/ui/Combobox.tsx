"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/PopoverContent";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  onSearch,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  disabled = false,
  className,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
  };

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
      // If the popover was closed, repopulate the full list
      onSearch?.("");
    }
  }, [open, onSearch]);

  // Find the selected option label
  const selectedLabel = React.useMemo(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  }, [options, value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <div className="px-3 py-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-sm">Cargando...</div>
          ) : options.length === 0 ? (
            <div className="py-6 text-center text-sm">{emptyMessage}</div>
          ) : (
            <div>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-accent",
                    value === option.value && "bg-accent"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
