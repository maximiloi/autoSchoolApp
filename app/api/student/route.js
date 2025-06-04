import { Prisma, PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    const { companyId } = token;
    if (!companyId) {
      return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 403 });
    }

    const data = await req.json();

    const newStudent = await prisma.student.create({
      data: {
        studentNumber: data.studentNumber,
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName,
        phone: data.phone,
        groupId: data.group,
        trainingCost: new Prisma.Decimal(data.trainingCost),
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        snils: data.snils,
        birthPlace: data.birthPlace,
        country: data.country,
        addressRegion: data.addressRegion,
        city: data.city,
        street: data.street,
        house: data.house,
        building: data.building,
        apartment: data.apartment,
        registrationAddress: data.registrationAddress,
        actualAddress: data.actualAddress,
        documentType: data.documentType,
        documentIssuer: data.documentIssuer,
        documentCode: data.documentCode,
        documentSeries: data.documentSeries,
        documentNumber: data.documentNumber,
        documentIssueDate: data.documentIssueDate ? new Date(data.documentIssueDate) : null,
        medicalSeries: data.medicalSeries,
        medicalNumber: data.medicalNumber,
        medicalIssuer: data.medicalIssuer,
        medicalIssueDate: data.medicalIssueDate ? new Date(data.medicalIssueDate) : null,
        licenseSeries: data.licenseSeries,
        license: data.license,
        region: data.region,
        education: data.education,
        placeOfWork: data.placeOfWork,
        medicalRestriction: data.medicalRestriction,
        allowedCategories: data.allowedCategories,
        companyId: companyId, // ✅ безопасно из токена
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании ученика:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
