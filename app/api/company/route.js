import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });

    const newCompany = await prisma.company.create({
      data: {
        ...data,
      },
    });

    if (!user?.companyId) {
      await prisma.user.update({
        where: { id: userId },
        data: { companyId: newCompany.id },
      });
    }

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания компании:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
