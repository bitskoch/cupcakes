"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useProforma } from "@/lib/store/useProforma";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const addItem = useProforma((s) => s.addItem);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card h-full">
      <div className="relative aspect-square w-full bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <h3 className="font-medium leading-tight text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
          <span className="font-semibold text-sm sm:text-base">
            {formatCurrency(product.price)}
          </span>
          <Button
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm"
            onClick={() =>
              addItem({ productId: product.id, name: product.name, price: product.price })
            }
          >
            <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}