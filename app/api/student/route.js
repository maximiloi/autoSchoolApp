import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();

    const newStudent = await prisma.student.create({
      data: {
        studentNumber: data.studentNumber,
        lastName: data.lastName,
        firstName: data.firstName,
        phone: data.phone,
        groupId: data.group,
        trainingCost: new Prisma.Decimal(data.trainingCost),
        birthDate: new Date(data.birthDate),
        middleName: data.middleName,
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
        companyId: data.companyId,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
