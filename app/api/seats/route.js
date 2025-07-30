import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://okulovka-auto.ru',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return new NextResponse(JSON.stringify({ error: 'Missing companyId' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'https://okulovka-auto.ru',
      },
    });
  }

  try {
    const today = new Date();

    const groups = await prisma.group.findMany({
      where: {
        companyId,
        startTrainingDate: {
          gt: today,
        },
      },
      select: {
        groupNumber: true,
        maxStudents: true,
        startTrainingDate: true,
        students: {
          select: { id: true },
        },
        practiceTeachers: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
    });

    const result = groups.map((group) => ({
      groupNumber: group.groupNumber,
      startTrainingDate: group.startTrainingDate,
      practiceTeachers: group.practiceTeachers.map((teacher) => {
        const parts = [
          teacher.lastName,
          teacher.firstName?.charAt(0) + '.',
          teacher.middleName?.charAt(0) + '.',
        ].filter(Boolean);
        return parts.join(' ');
      }),
      studentCount: group.maxStudents - group.students.length,
    }));

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://okulovka-auto.ru',
      },
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://okulovka-auto.ru',
      },
    });
  }
}
