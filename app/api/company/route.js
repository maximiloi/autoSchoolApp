import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();

    const newGroup = await prisma.company.create({
      data: {
        ...data,
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания компании:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
