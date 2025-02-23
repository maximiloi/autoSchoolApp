import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req) {
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  return NextResponse.json(user);
}
