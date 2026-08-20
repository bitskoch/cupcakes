import { prisma } from "@/lib/prisma";
import type { CategoryDTO } from "@/types";
import { CatalogClient } from "@/components/catalog-client";

// Siempre datos frescos: el admin puede cambiar precios/stock en cualquier momento.
export const dynamic = "force-dynamic";

async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: { where: { isActive: true }, orderBy: { name: "asc" } },
    },
  });

  // Prisma.Decimal no es serializable tal cual hacia un Client Component.
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    order: c.order,
    products: c.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      isActive: p.isActive,
      categoryId: p.categoryId,
    })),
  }));
}

export default async function HomePage() {
  const categories = await getCategories();

  return <CatalogClient categories={categories} />;
}
