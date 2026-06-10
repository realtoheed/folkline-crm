import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const deal = await prisma.deal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.deal.update({
    where: { id },
    data: { stage: body.stage ?? deal.stage },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const deal = await prisma.deal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
