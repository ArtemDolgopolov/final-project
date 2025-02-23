import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { RouteHandlerContext } from "next/server";

export async function GET(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    await auth.api.getSession({ headers: headers() });

    const formId = context.params.id;
    if (!formId) {
      return NextResponse.json({ error: "Invalid request: missing ID" }, { status: 400 });
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { responses: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form is not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error during uploading form:", error);
    return NextResponse.json({ error: "Error during uploading form" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user || (session.user.role !== "user" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formId = context.params.id;
    if (!formId) {
      return NextResponse.json({ error: "Invalid request: missing ID" }, { status: 400 });
    }

    const userId = session.user.id;
    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }

    const response = await prisma.response.create({
      data: {
        id: uuidv4(),
        formId,
        userId,
        answers,
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error during saving response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const formId = context.params.id;
    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Wrong data" }, { status: 400 });
    }

    let existingResponse = await prisma.response.findFirst({
      where: { userId: session.user.id, formId },
    });

    if (existingResponse) {
      existingResponse = await prisma.response.update({
        where: { id: existingResponse.id },
        data: {
          answers,
          createdAt: new Date(),
        },
      });
    } else {
      existingResponse = await prisma.response.create({
        data: {
          userId: session.user.id,
          formId,
          answers,
          createdAt: new Date(),
        },
      });
    }

    return NextResponse.json(existingResponse);
  } catch (error) {
    console.error("Error during updating response:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteHandlerContext<{ id: string }>) {
  try {
    const formId = context.params.id;

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    await prisma.form.delete({
      where: { id: formId },
    });

    return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during deleting form:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}