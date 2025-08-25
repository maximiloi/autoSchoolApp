import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId } = token;
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
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const data = await req.json();

    const newGroup = await prisma.group.create({
      data: {
        groupNumber: data.groupNumber,
        maxStudents: data.maxStudents,
        category: data.category,
        startTrainingDate: new Date(data.startTrainingDate),
        endTrainingDate: new Date(data.endTrainingDate),
        lessonStartTime: data.lessonStartTime,
        companyId,
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
