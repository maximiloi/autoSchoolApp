import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const companyId = searchParams.get('companyId');
  const currentGroupId = searchParams.get('groupId');

  if (!q || q.length < 2 || !companyId || !currentGroupId) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        companyId,
        groupId: { not: currentGroupId },
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { middleName: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: {
        group: {
          select: {
            groupNumber: true,
          },
        },
      },
      take: 10,
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Ошибка поиска студентов:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
