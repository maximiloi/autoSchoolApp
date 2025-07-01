import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  const link = `https://t.me/${username}?start=${id}`;

  const qr = await QRCode.toDataURL(link);
  return NextResponse.json({ qr });
}
