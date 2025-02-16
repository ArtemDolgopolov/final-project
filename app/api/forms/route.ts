import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, questions } = await req.json();

    if (!title || !description || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newForm = await prisma.form.create({
      data: {
        id: uuidv4(),
        title,
        description,
        questions: JSON.parse(JSON.stringify(questions)),
        userId: session.user.id,
      },
    });

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}