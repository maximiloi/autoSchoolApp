import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { companyId } = session.user;

  try {
    const cars = await prisma.car.findMany({
      where: { companyId },
    });
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { companyId } = session.user;
  const body = await req.json();

  try {
    const newCar = await prisma.car.create({
      data: {
        ...body,
        companyId,
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка при создании' }, { status: 500 });
  }
}
