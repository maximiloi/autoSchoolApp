import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID ученика не указан' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ error: 'Ученика не найдена' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Ошибка при получении Ученика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID ученика не указан' }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Ученик успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении ученика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (data.group) {
      data.groupId = data.group;
      delete data.group;
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: 'Ученик успешно обновлен', updatedStudent });
  } catch (error) {
    console.error('Ошибка обновления студента:', error.message);
    return NextResponse.json({ error: 'Ошибка при обновлении данных студента' }, { status: 500 });
  }
}
