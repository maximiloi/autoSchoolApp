import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const body = await req.json();
    const { sessions } = body;

    const allSessions = [];

    for (const studentId in sessions) {
      const entries = sessions[studentId];
      for (const date in entries) {
        const slot = entries[date];
        if (slot && slot !== '-') {
          allSessions.push({
            studentId,
            date: new Date(date),
            slot,
          });
        }
      }
    }

    await prisma.drivingSession.deleteMany({
      where: {
        OR: allSessions.map((s) => ({
          studentId: s.studentId,
          date: s.date,
        })),
      },
    });

    await prisma.drivingSession.createMany({
      data: allSessions,
    });

    return NextResponse.json(allSessions);
  } catch (error) {
    console.error('Ошибка сохранения занятий:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
