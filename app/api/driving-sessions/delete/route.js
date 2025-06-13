import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token || !token.companyId) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { studentId, date } = await req.json();

    if (!studentId || !date) {
      return NextResponse.json({ error: 'Недостаточно данных для удаления' }, { status: 400 });
    }

    const dateObj = new Date(date);

    await prisma.drivingSession.deleteMany({
      where: {
        studentId,
        date: dateObj,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления сессии:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
