"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useProforma } from "@/lib/store/useProforma";

export function ProformaSidebar() {
  const { items, setQuantity, removeItem, clear, total } = useProforma();

  if (items.length === 0) {
    return (
      <aside className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <p>Tu proforma está vacía.</p>
        <p>Agrega productos del catálogo para empezar.</p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">Tu proforma</h2>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">
          Vaciar
        </button>
      </div>

      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{item.name}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Quitar ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total())}</span>
        </div>
        <Button className="w-full">Generar proforma</Button>
      </div>
    </aside>
  );
}
