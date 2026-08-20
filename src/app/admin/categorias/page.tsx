"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, type CategoryInput } from "@/types";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  order: number;
  products: { id: string }[];
};

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", order: 0 },
  });

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/categorias");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function startEdit(category: CategoryRow) {
    setEditingId(category.id);
    reset({ name: category.name, order: category.order });
  }

  function cancelEdit() {
    setEditingId(null);
    reset({ name: "", order: 0 });
  }

  async function onSubmit(values: CategoryInput) {
    setError(null);
    const url = editingId ? `/api/categorias/${editingId}` : "/api/categorias";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error?.formErrors?.[0] ?? "No se pudo guardar la categoría.");
      return;
    }

    cancelEdit();
    loadCategories();
  }

  async function deleteCategory(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;

    const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      alert(body.error ?? "No se pudo eliminar.");
      return;
    }
    loadCategories();
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-4 text-xl font-bold">Categorías</h1>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay categorías. Crea la primera →</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.products.length} producto(s) · orden {cat.order}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteCategory(cat.id)}>
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
          <h2 className="font-semibold">{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} aria-label="Cancelar edición">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="mb-3 space-y-1">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Ej. Bocaditos" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="mb-4 space-y-1">
          <Label htmlFor="order">Orden de despliegue</Label>
          <Input id="order" type="number" {...register("order")} />
          <p className="text-xs text-muted-foreground">Menor número aparece primero en el catálogo.</p>
        </div>

        {error && <p className="mb-3 text-xs text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {editingId ? "Guardar cambios" : "Crear categoría"}
        </Button>
      </form>
    </div>
  );
}
