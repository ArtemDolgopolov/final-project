import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest, context: { params: { id?: string } }) {
 try {
   const formId = context.params?.id;
   if (!formId) {
     return NextResponse.json({ error: 'Не указан ID формы' }, { status: 400 });
   }

   const likeCount = await prisma.like.count({
     where: { formId },
   });

   return NextResponse.json({ likeCount });
 } catch (error) {
   console.error('Ошибка получения количества лайков:', error);
   return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
 }
}

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

    const existingLike = await prisma.like.findFirst({
      where: {
        formId,
        userId: session.user.id,
      },
    });
    if (existingLike) {
      return NextResponse.json({ error: 'Лайк уже проставлен' }, { status: 400 });
    }

    const newLike = await prisma.like.create({
      data: {
        id: uuidv4(),
        formId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newLike, { status: 201 });
  } catch (error) {
    console.error('Ошибка при проставлении лайка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}