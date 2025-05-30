import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId } = session.user;

  try {
    const teachers = await prisma.teacher.findMany({
      where: { companyId },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId, id: userId } = session.user;
  const data = await req.json();

  try {
    const newTeacher = await prisma.teacher.create({
      data: {
        ...data,
        companyId,
        createdBy: userId,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        licenseIssueDate: data.licenseIssueDate ? new Date(data.licenseIssueDate) : null,
      },
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка при создании' }, { status: 500 });
  }
}
