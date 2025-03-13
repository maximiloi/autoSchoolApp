import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID группы не указан' }, { status: 400 });
    }

    const groups = await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        students: true,
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
