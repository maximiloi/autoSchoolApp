import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token?.id) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const userId = token.id;
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
