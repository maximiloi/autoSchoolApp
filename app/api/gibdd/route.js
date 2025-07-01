import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId } = token;
  if (!companyId) {
    return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
  }

  try {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: 'Компания не найдена' }, { status: 404 });
    }

    const gibddData = company.gibddDepartmentId
      ? await prisma.gibddDepartment.findFirst({
          where: { id: company.gibddDepartmentId },
        })
      : null;
    return NextResponse.json(gibddData || {});
  } catch (error) {
    console.error('Ошибка при загрузке данных ГИБДД:', error?.message || 'Неизвестная ошибка');
    return NextResponse.json({ error: 'Ошибка при загрузке данных' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
  }

  const { companyId } = token;
  if (!companyId) {
    return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
  }

  const data = await req.json();
  if (!data || !data.departmentName) {
    return NextResponse.json({ error: 'Отсутствует departmentName' }, { status: 400 });
  }
  const { departmentName, officerName, officerRank, district } = data;

  try {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: 'Компания не найдена' }, { status: 404 });
    }

    const existingGibdd = company.gibddDepartmentId
      ? await prisma.gibddDepartment.findFirst({
          where: { id: company.gibddDepartmentId },
        })
      : null;

    const gibddData = await prisma.gibddDepartment.upsert({
      where: { id: existingGibdd?.id || '' },
      update: {
        departmentName,
        officerName: officerName || null,
        officerRank: officerRank || null,
        district: district || null,
      },
      create: {
        departmentName,
        officerName: officerName || null,
        officerRank: officerRank || null,
        district: district || null,
      },
    });

    await prisma.company.update({
      where: { id: companyId },
      data: { gibddDepartmentId: gibddData.id },
    });

    return NextResponse.json({ data: gibddData });
  } catch (error) {
    console.error('Ошибка при сохранении данных ГИБДД:', error?.message || 'Неизвестная ошибка');
    return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
  }
}
