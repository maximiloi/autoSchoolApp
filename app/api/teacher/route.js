import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const token = await getToken({ req, secret });
  if (!token || !token.companyId) {
    return NextResponse.json({ message: 'Неавторизованный доступ' }, { status: 401 });
  }

  try {
    const teachers = await prisma.teacher.findMany({
      where: { companyId: token.companyId },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Ошибка загрузки учителей:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret });
  if (!token || !token.companyId || !token.id) {
    return NextResponse.json({ message: 'Неавторизованный доступ' }, { status: 401 });
  }

  const data = await req.json();

  try {
    const newTeacher = await prisma.teacher.create({
      data: {
        ...data,
        companyId: token.companyId,
        createdBy: token.id,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        licenseIssueDate: data.licenseIssueDate ? new Date(data.licenseIssueDate) : null,
      },
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания учителя:', error);
    return NextResponse.json({ message: 'Ошибка при создании' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
