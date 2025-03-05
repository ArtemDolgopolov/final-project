import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { salesforceRegistered: true },
  });

  return NextResponse.json({ salesforceRegistered: user?.salesforceRegistered || false });
}