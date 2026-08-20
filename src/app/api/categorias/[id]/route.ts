import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/types";
import { slugify } from "@/lib/slugify";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = categorySchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = { ...parsed.data, ...(parsed.data.name && { slug: slugify(parsed.data.name) }) };

  const category = await prisma.category.update({ where: { id: params.id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: Params) {
  const productsCount = await prisma.product.count({ where: { categoryId: params.id } });

  if (productsCount > 0) {
    return NextResponse.json(
      { error: "No se puede eliminar: la categoría tiene productos asociados." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
