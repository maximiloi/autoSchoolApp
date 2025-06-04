import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
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
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Ошибка получения занятий:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const body = await req.json();

    if (!body || !body.sessions || !Array.isArray(body.sessions)) {
      return NextResponse.json({ error: 'sessions должно быть массивом' }, { status: 400 });
    }

    const sessionResults = [];

    for (const { studentId, date, slot } of body.sessions) {
      if (!studentId || !date) {
        sessionResults.push({ error: 'studentId и date обязательны для каждого занятия' });
        continue;
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        sessionResults.push({ studentId, error: 'Некорректная дата' });
        continue;
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId, companyId },
      });

      if (!student) {
        sessionResults.push({ studentId, error: 'Студент не найден или нет доступа' });
        continue;
      }

      const existingSession = await prisma.drivingSession.findFirst({
        where: { studentId, date: parsedDate },
      });

      let sessionData;
      if (existingSession) {
        sessionData = await prisma.drivingSession.update({
          where: { id: existingSession.id },
          data: { slot },
        });
      } else {
        sessionData = await prisma.drivingSession.create({
          data: {
            studentId,
            date: parsedDate,
            slot,
          },
        });
      }

      sessionResults.push(sessionData);
    }

    return NextResponse.json(sessionResults);
  } catch (error) {
    console.error('Ошибка сохранения занятий:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
