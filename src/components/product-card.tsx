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
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-square w-full bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-medium leading-tight">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          <Button
            size="sm"
            onClick={() =>
              addItem({ productId: product.id, name: product.name, price: product.price })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
