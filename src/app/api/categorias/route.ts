import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/types";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { products: { where: { isActive: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, order } = parsed.data;

  const category = await prisma.category.create({
    data: { name, order, slug: slugify(name) },
  });

  return NextResponse.json(category, { status: 201 });
}
