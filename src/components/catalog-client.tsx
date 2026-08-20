"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { ProformaSidebar } from "@/components/proforma-sidebar";
import type { CategoryDTO } from "@/types";

export function CatalogClient({ categories }: { categories: CategoryDTO[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");

  const current = categories.find((c) => c.id === activeCategory);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-4 text-2xl font-bold text-pink-700">Nuestros Productos</h1>

        {/* Tabs de categoría */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 rounded-full border border-border px-4 py-2 text-sm transition-colors",
                cat.id === activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent hover:bg-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        {current && current.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {current.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aún no hay productos en esta categoría.
          </p>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:h-fit">
        <ProformaSidebar />
      </div>
    </div>
  );
}
