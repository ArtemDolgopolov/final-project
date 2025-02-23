import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { RouteHandlerContext } from "next/server";

export async function POST(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const formId = context.params.id;
    if (!formId) {
      return NextResponse.json({ error: "No ID of form" }, { status: 400 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "A comment text is necessary" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        formId,
        userId: session.user.id,
        text,
      },
      include: {
        userComments: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error during saving comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    const formId = context.params.id;
    if (!formId) {
      return NextResponse.json({ error: "No ID of form" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { formId },
      orderBy: { createdAt: "asc" },
      include: {
        userComments: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error during loading comments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}