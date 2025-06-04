import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

async function getAuth(req) {
  const token = await getToken({ req, secret });
  if (!token || !token.companyId) {
    throw { status: 401, message: 'Неавторизованный доступ' };
  }
  return token;
}

export async function GET(req, { params }) {
  try {
    const { companyId } = await getAuth(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID преподавателя не указан' }, { status: 400 });
    }

    const teacher = await prisma.teacher.findFirst({
      where: { id, companyId },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Преподаватель не найден' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Ошибка сервера';
    console.error('Ошибка при получении преподавателя:', error);
    return NextResponse.json({ error: message }, { status });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req, { params }) {
  try {
    const { companyId } = await getAuth(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID преподавателя не указан' }, { status: 400 });
    }

    const teacher = await prisma.teacher.findFirst({ where: { id, companyId } });
    if (!teacher) {
      return NextResponse.json({ error: 'Преподаватель не найден' }, { status: 404 });
    }

    await prisma.teacher.delete({ where: { id } });

    return NextResponse.json({ message: 'Преподаватель успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении преподавателя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req, { params }) {
  try {
    const { companyId } = await getAuth(req);
    const { id } = params;
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID преподавателя не указан' }, { status: 400 });
    }

    const teacher = await prisma.teacher.findFirst({ where: { id, companyId } });
    if (!teacher) {
      return NextResponse.json({ error: 'Преподаватель не найден' }, { status: 404 });
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error('Ошибка обновления преподавателя:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении данных преподавателя' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
