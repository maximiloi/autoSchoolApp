import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function PATCH(req, { params }) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id } = await params;
    const { isActive } = await req.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Некорректное значение isActive' }, { status: 400 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: { isActive },
      include: {
        students: { include: { payments: true } },
        theoryTeachers: true,
        practiceTeachers: { include: { cars: true } },
      },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (err) {
    console.error('Ошибка архивации:', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
