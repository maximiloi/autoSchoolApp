import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID автомобиля не указан' }, { status: 400 });
    }

    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Автомобиль успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
