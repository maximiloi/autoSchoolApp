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
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!studentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'studentId, startDate и endDate обязательны' },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { group: true },
    });

    if (!student || student.group.companyId !== companyId) {
      return NextResponse.json({ error: 'Студент не найден или нет доступа' }, { status: 404 });
    }

    const sessions = await prisma.drivingSession.findMany({
      where: {
        studentId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        date: true,
        slot: true,
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Ошибка получения сессий по студенту:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
