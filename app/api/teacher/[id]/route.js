import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
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
    console.error('Ошибка при получении компании:', error);
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
