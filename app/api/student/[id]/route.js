import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID ученика не указан' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ error: 'Ученик не найден' }, { status: 404 });
    }

    if (student.companyId !== companyId) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Ошибка при получении ученика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID ученика не указан' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!student || student.companyId !== companyId) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    await prisma.student.delete({ where: { id } });

    return NextResponse.json({ message: 'Ученик успешно удалён' });
  } catch (error) {
    console.error('Ошибка при удалении ученика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID ученика не указан' }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingStudent || existingStudent.companyId !== companyId) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const data = await req.json();

    if (data.group) {
      data.groupId = data.group;
      delete data.group;
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: 'Ученик успешно обновлён', updatedStudent });
  } catch (error) {
    console.error('Ошибка обновления студента:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении данных студента' }, { status: 500 });
  }
}
