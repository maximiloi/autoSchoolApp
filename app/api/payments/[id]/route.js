import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID платежа не указан' }, { status: 400 });
    }

    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Платёж удалён' });
  } catch (error) {
    console.error('Ошибка удаления платежа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
