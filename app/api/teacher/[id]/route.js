import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
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
      return NextResponse.json({ error: 'ID преподавателя не указан' }, { status: 400 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Преподавателя не найдена' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Ошибка при получении преподавателя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID преподавателя не указан' }, { status: 400 });
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Преподаватель успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении преподавателя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error('Ошибка обновления преподавателя:', error.message);
    return NextResponse.json(
      { error: 'Ошибка при обновлении данных преподавателя' },
      { status: 500 },
    );
  }
}
