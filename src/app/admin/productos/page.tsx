"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { productSchema, type ProductInput } from "@/types";

type CategoryOption = { id: string; name: string };

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
};

export default function ProductosPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", price: 0, categoryId: "", imageUrl: "", isActive: true },
  });

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/categorias");
    const cats: { id: string; name: string; products: ProductRow[] }[] = await res.json();

    setCategories(cats.map((c) => ({ id: c.id, name: c.name })));
    // Los productos vienen anidados en cada categoría; los aplanamos para la tabla.
    setProducts(cats.flatMap((c) => c.products));
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function startEdit(product: ProductRow) {
    setEditingId(product.id);
    reset({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? "",
      isActive: product.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset({ name: "", description: "", price: 0, categoryId: "", imageUrl: "", isActive: true });
  }

  async function onSubmit(values: ProductInput) {
    setError(null);
    const url = editingId ? `/api/productos/${editingId}` : "/api/productos";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error?.formErrors?.[0] ?? "No se pudo guardar el producto.");
      return;
    }

    cancelEdit();
    loadData();
  }

  async function deleteProduct(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-4 text-xl font-bold">Productos</h1>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Primero crea al menos una categoría en la sección Categorías.
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay productos. Crea el primero →</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                  {p.imageUrl && (
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(p.price)}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteProduct(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-fit rounded-lg border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} aria-label="Cancelar edición">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="mb-3 space-y-1">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Ej. Torta de chocolate" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="mb-3 space-y-1">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <div className="mb-3 space-y-1">
          <Label htmlFor="price">Precio</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="mb-3 space-y-1">
          <Label htmlFor="categoryId">Categoría</Label>
          <Select id="categoryId" {...register("categoryId")}>
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="mb-4 space-y-1">
          <Label htmlFor="imageUrl">URL de imagen</Label>
          <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
          <p className="text-xs text-muted-foreground">
            Por ahora pega una URL pública. El upload de imágenes se conecta más adelante.
          </p>
          {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
        </div>

        {error && <p className="mb-3 text-xs text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {editingId ? "Guardar cambios" : "Crear producto"}
        </Button>
      </form>
    </div>
  );
}
