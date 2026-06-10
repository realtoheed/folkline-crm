import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(deals);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const company = body.company as string;
  const contact = body.contact as string;
  const value = Number(body.value);

  if (!company || !contact || !value) {
    return NextResponse.json({ error: "Company, contact and value required" }, { status: 400 });
  }

  const deal = await prisma.deal.create({
    data: {
      company,
      contact,
      value,
      stage: "Qualified",
      avatar: company.slice(0, 2).toUpperCase(),
      color: "violet",
      due: new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      activity: "Deal created just now",
      userId: session.user.id,
    },
  });

  return NextResponse.json(deal, { status: 201 });
}
