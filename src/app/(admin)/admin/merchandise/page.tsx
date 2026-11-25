"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { mockMerchandise } from "@/data/adminMockData";
import { MerchandiseItem } from "@/types/admin";
import { SectionHeader, Card, StatusBadge } from "@/components/admin/ui/AdminUIKit";

export default function AdminMerchandisePage() {
  const [items, setItems] = useState<MerchandiseItem[]>(mockMerchandise);

  const handleAdjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newStock = Math.max(0, item.stockQuantity + delta);
        const newStatus =
          newStock === 0
            ? "out_of_stock"
            : newStock <= item.reorderThreshold
            ? "low_stock"
            : "in_stock";
        return { ...item, stockQuantity: newStock, status: newStatus };
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Lodge & Guest Apparel Store"
        title="Safari Merchandise & Field Gear Inventory"
        action={
          <button
            onClick={() => alert("Product creator initiated.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-safari-night font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product SKU
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            noPadding
            className="overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-safari-night">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/75 text-white border border-white/10">
                  SKU: {item.sku}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gold-400">
                    {item.category.replace("_", " ")}
                  </span>
                  <StatusBadge
                    status={item.status.replace("_", " ")}
                    variant={
                      item.status === "in_stock"
                        ? "confirmed"
                        : item.status === "low_stock"
                        ? "pending"
                        : "alert"
                    }
                  />
                </div>

                <h3 className="font-serif text-lg text-white font-normal">{item.title}</h3>

                <div className="pt-2 flex items-baseline justify-between font-mono text-xs">
                  <div className="text-safari-sand/70">
                    Retail:{" "}
                    <span className="font-serif text-base text-white font-bold">
                      ${item.priceUsd}
                    </span>
                  </div>
                  <div className="text-safari-sand/50 text-[11px]">
                    Cost: ${item.costUsd} (Margin:{" "}
                    {Math.round(((item.priceUsd - item.costUsd) / item.priceUsd) * 100)}%)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-safari-night border-t border-safari-border flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-safari-sand/50 text-[10px] block">ON HAND:</span>
                <span className="text-white font-bold text-sm">
                  {item.stockQuantity} Units
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdjustStock(item.id, -1)}
                  aria-label={`Decrease stock for ${item.title}`}
                  className="w-8 h-8 rounded-lg bg-safari-card border border-safari-border hover:border-gold-400 text-white flex items-center justify-center font-bold transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustStock(item.id, +1)}
                  aria-label={`Increase stock for ${item.title}`}
                  className="w-8 h-8 rounded-lg bg-safari-card border border-safari-border hover:border-gold-400 text-white flex items-center justify-center font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
