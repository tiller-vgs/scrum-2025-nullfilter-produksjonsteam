import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const openingHours = await prisma.openingHours.findMany();
    return NextResponse.json(openingHours);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch opening hours' }, { status: 500 });
  }
}