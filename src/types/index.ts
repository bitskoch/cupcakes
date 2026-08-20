import { z } from "zod";

// ---------- Categoría ----------
export const categorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  order: z.coerce.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// ---------- Producto ----------
export const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});
export type ProductInput = z.infer<typeof productSchema>;

// ---------- Serializados para el cliente (Decimal -> number) ----------
export type ProductDTO = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
  products: ProductDTO[];
};

// ---------- Item de la proforma (estado del cliente) ----------
export type ProformaItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};
