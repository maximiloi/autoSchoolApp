import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = session.user;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    if (!groupId) {
      return NextResponse.json({ error: 'groupId обязателен' }, { status: 400 });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId, companyId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Группа не найдена или нет доступа' }, { status: 404 });
    }

    const sessions = await prisma.drivingSession.findMany({
      where: { student: { groupId } },
      include: { student: true },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Ошибка получения занятий:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// 🔹 Создать или обновить занятие
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = session.user;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { studentId, date, duration } = await req.json();
    if (!studentId || !date) {
      return NextResponse.json({ error: 'studentId и date обязательны' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId, companyId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Студент не найден или нет доступа' }, { status: 404 });
    }

    const existingSession = await prisma.drivingSession.findFirst({
      where: { studentId, date },
    });

    let sessionData;
    if (existingSession) {
      sessionData = await prisma.drivingSession.update({
        where: { id: existingSession.id },
        data: { duration },
      });
    } else {
      sessionData = await prisma.drivingSession.create({
        data: { studentId, date, duration },
      });
    }

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('Ошибка сохранения занятия:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
