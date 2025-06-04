import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID группы не указан' }, { status: 400 });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        students: { include: { payments: true } },
        theoryTeachers: true,
        practiceTeachers: { include: { cars: true } },
      },
    });

    if (!group || group.companyId !== companyId) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении группы:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID группы не указан' }, { status: 400 });
    }

    const { startTrainingDate, endTrainingDate } = await req.json();
    if (!startTrainingDate || !endTrainingDate) {
      return NextResponse.json({ error: 'Обе даты обязательны' }, { status: 400 });
    }

    const existingGroup = await prisma.group.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingGroup || existingGroup.companyId !== companyId) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        startTrainingDate: new Date(startTrainingDate),
        endTrainingDate: new Date(endTrainingDate),
      },
      include: {
        students: { include: { payments: true } },
        theoryTeachers: true,
        practiceTeachers: { include: { cars: true } },
      },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении дат группы:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
