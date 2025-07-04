import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

import { exportDpoStudentsToBuffer } from '@/lib/actions/export-dpo';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const isFirstHalf = searchParams.get('isFirstHalf');

    const buffer = await exportDpoStudentsToBuffer(companyId, year, isFirstHalf);

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename=exported_dpo.xlsx',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Ошибка при получении компании:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
