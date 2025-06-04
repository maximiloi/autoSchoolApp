import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId } = session.user;
  if (!companyId) {
    return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
  }

  try {
    const groups = await prisma.group.findMany({
      where: {
        companyId,
      },
      include: {
        students: {
          select: {
            id: true,
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

export async function POST(req) {
  try {
    const data = await req.json();

    const newGroup = await prisma.group.create({
      data: {
        groupNumber: data.groupNumber,
        category: data.category,
        startTrainingDate: new Date(data.startTrainingDate),
        endTrainingDate: new Date(data.endTrainingDate),
        companyId: data.companyId,
        theoryTeachers: {
          connect: data.theoryTeachers.map((teacher) => ({ id: teacher.id })),
        },
        practiceTeachers: {
          connect: data.practiceTeachers.map((teacher) => ({ id: teacher.id })),
        },
      },
      include: {
        theoryTeachers: true,
        practiceTeachers: true,
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
