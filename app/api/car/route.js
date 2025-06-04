import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const token = await getToken({ req });
  if (!token || !token.companyId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cars = await prisma.car.findMany({
      where: { companyId: token.companyId },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Ошибка автомобили не найдены', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = await getToken({ req });
  if (!token || !token.companyId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const newCar = await prisma.car.create({
      data: {
        ...body,
        companyId: token.companyId,
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания автомобиля', error);
    return NextResponse.json({ message: 'Ошибка при создании' }, { status: 500 });
  }
}
