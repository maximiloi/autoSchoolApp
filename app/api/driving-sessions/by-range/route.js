import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!groupId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'groupId, startDate и endDate обязательны' },
        { status: 400 },
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId, companyId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Группа не найдена или нет доступа' }, { status: 404 });
    }

    const sessions = await prisma.drivingSession.findMany({
      where: {
        student: { groupId },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Ошибка получения занятий с фильтром по дате:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
