import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
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
        const parts = [teacher.lastName, teacher.firstName, teacher.middleName].filter(Boolean);
        return parts.join(' ');
      }),
      studentCount: group.students.length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
