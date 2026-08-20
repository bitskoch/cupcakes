import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { description, imageUrl, ...rest } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...rest,
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
