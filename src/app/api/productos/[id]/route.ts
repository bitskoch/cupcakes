import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/types";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { description, imageUrl, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(description !== undefined && { description: description || null }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
