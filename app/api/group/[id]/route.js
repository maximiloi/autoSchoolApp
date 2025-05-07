import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = session.user;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID группы не указан' }, { status: 400 });
    }

    const groups = await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        students: {
          include: {
            payments: true,
          },
        },
        theoryTeachers: true,
        practiceTeachers: {
          include: {
            cars: true,
          },
        },
      },
    });

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = session.user;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID группы не указан' }, { status: 400 });
    }

    const body = await req.json();
    const { startTrainingDate, endTrainingDate } = body;

    if (!startTrainingDate || !endTrainingDate) {
      return NextResponse.json({ error: 'Обе даты обязательны' }, { status: 400 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      include: {
        students: {
          include: {
            payments: true,
          },
        },
        theoryTeachers: true,
        practiceTeachers: {
          include: {
            cars: true,
          },
        },
      },
      data: {
        startTrainingDate: new Date(startTrainingDate),
        endTrainingDate: new Date(endTrainingDate),
      },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении дат группы:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
