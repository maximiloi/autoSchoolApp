import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { studentId, amount } = await req.json();

    if (!studentId || !amount || isNaN(amount)) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount: Number(amount),
        paymentDate: new Date(),
      },
    });

    return NextResponse.json({ payment });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
