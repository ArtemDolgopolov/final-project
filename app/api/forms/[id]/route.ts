import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest, context: { params: { id?: string } }) {
 try {
     const session = await auth.api.getSession({ headers: await headers() });

     // Проверяем, передан ли параметр id
     const formId = context.params?.id;
     if (!formId) {
         return NextResponse.json({ error: "Invalid request: missing ID" }, { status: 400 });
     }

     const form = await prisma.form.findUnique({
         where: { id: formId },
         include: { responses: true },
     });

     if (!form) {
         return NextResponse.json({ error: "Форма не найдена" }, { status: 404 });
     }

     return NextResponse.json(form);
 } catch (error) {
     console.error("Ошибка загрузки формы:", error);
     return NextResponse.json({ error: "Ошибка загрузки формы" }, { status: 500 });
 }
}

export async function POST(req: NextRequest, context: { params: { id?: string } }) {
 try {
     const session = await auth.api.getSession({ headers: req.headers });

     if (!session?.user || (session.user.role !== "user" && session.user.role !== "admin")) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     }

     const formId = context.params?.id;
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
     console.error("Ошибка при сохранении ответа:", error);
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
 }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
 try {
   const session = await auth.api.getSession({ headers: req.headers });
   if (!session?.user?.id) {
     return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
   }

   const formId = params.id;
   const { answers } = await req.json();

   if (!answers || typeof answers !== "object") {
     return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
   }

   // Проверяем, существует ли уже ответ пользователя на эту форму
   let existingResponse = await prisma.response.findFirst({
     where: { userId: session.user.id, formId },
   });

   if (existingResponse) {
     // Если ответ уже существует, обновляем его и обновляем createdAt
     existingResponse = await prisma.response.update({
       where: { id: existingResponse.id },
       data: {
         answers,
         createdAt: new Date(), // Обновляем время
       },
     });
   } else {
     // Если ответа нет, создаем новый
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
   console.error("Ошибка обновления ответа:", error);
   return NextResponse.json({ error: "Ошибка на сервере" }, { status: 500 });
 }
}