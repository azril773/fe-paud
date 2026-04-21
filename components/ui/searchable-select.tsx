"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";

interface SearchableSelectProps<T extends { id: string; name: string }> {
  label: string;
  placeholder?: string;
  items: T[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  itemsPerPage?: number;
}

export function SearchableSelect<T extends { id: string; name: string }>({
  label,
  placeholder = "Cari...",
  items,
  value,
  onChange,
  disabled = false,
  isLoading = false,
  itemsPerPage = 10,
}: SearchableSelectProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const selectedItem = items.find((item) => item.id === value);

  const handleSelect = (itemId: string) => {
    onChange(itemId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-600" htmlFor={`searchable-select-${label}`}>{label}</Label>

      <div className="relative">
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          disabled={disabled || isLoading}
          variant="outline"
          className="w-full justify-start rounded-sm px-3 py-2 text-left"
        >
          {selectedItem ? selectedItem.name : placeholder}
        </Button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 border rounded-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 shadow-lg z-50">
            <div className="p-3 border-b dark:border-zinc-600 placeholder:text-gray-400">
              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="dark:bg-zinc-600 dark:border-zinc-500 placeholder:text-gray-400 nonito "
                autoFocus
              />
            </div>

            {/* Items List */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : paginatedItems.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  {filteredItems.length === 0 ? "Tidak ada data" : "Tidak ada hasil"}
                </div>
              ) : (
                <div>
                  {paginatedItems.map((item) => (
                    <Button
                      type="button"
                      key={item.id}
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(item.id);
                      }}
                      className={`h-auto w-full justify-start rounded-none px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-zinc-600 transition ${
                        value === item.id ? "bg-blue-100 dark:bg-zinc-500" : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="p-2 border-t dark:border-zinc-600 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={currentPage === 1}
                    className="dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    disabled={currentPage === totalPages}
                    className="dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
