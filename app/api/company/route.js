import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const company = await prisma.company.findMany();
  return NextResponse.json(company);
}

export async function POST(req) {
  try {
    const data = await req.json();

    const company = await prisma.company.create({
      data,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при сохранении компании' }, { status: 500 });
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
    return NextResponse.json({ error: 'Ошибка при обновлении данных компании' }, { status: 500 });
  }
}
