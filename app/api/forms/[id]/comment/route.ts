import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest, context: { params: { id?: string } }) {
 try {
   const session = await auth.api.getSession({ headers: req.headers });
   if (!session?.user) {
     return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
   }

   const formId = context.params?.id;
   if (!formId) {
     return NextResponse.json({ error: 'Не указан ID формы' }, { status: 400 });
   }

   const { text } = await req.json();
   if (!text || typeof text !== 'string') {
     return NextResponse.json({ error: 'Необходимо указать текст комментария' }, { status: 400 });
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
   console.error('Ошибка при сохранении комментария:', error);
   return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
 }
}

export async function GET(req: NextRequest, context: { params: { id?: string } }) {
  try {
    const formId = context.params?.id;
    if (!formId) {
      return NextResponse.json({ error: 'Не указан ID формы' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { formId },
      orderBy: { createdAt: 'asc' },
      include: {
        userComments: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Ошибка загрузки комментариев:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}