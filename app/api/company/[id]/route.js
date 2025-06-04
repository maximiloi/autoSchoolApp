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
      return NextResponse.json({ error: 'ID компании не указан' }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        groups: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Компания не найдена' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Ошибка при получении компании:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();

    const updatedCompany = await prisma.company.upsert({
      where: { inn: data.inn },
      update: data,
      create: data,
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении данных компании', error);
    return NextResponse.json({ error: 'Ошибка при обновлении данных компании' }, { status: 500 });
  }
}
