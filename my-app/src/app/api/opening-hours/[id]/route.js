import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    console.log(`PUT /api/opening-hours/${params.id}: Updating hours`);
    
    const { id } = params;
    const body = await request.json();
    const { hours } = body;

    if (!hours) {
      return NextResponse.json(
        { error: "Hours are required" },
        { status: 400 }
      );
    }

    // Validate the hours format (optional)
    const isValidFormat = /^([0-9]{1,2}:[0-9]{2}\s*-\s*[0-9]{1,2}:[0-9]{2}|Stengt)$/.test(hours);
    if (!isValidFormat) {
      return NextResponse.json(
        { error: "Hours must be in format 'HH:MM - HH:MM' or 'Stengt'" },
        { status: 400 }
      );
    }

    const openingHours = await prisma.openingHours.update({
      where: { id: Number(id) },
      data: { hours },
    });

    console.log(`Successfully updated hours for ${openingHours.day} to ${hours}`);
    return NextResponse.json(openingHours);
  } catch (error) {
    console.error("Database error in PUT /api/opening-hours:", error);
    return NextResponse.json(
      { error: "Failed to update opening hours", details: error.message },
      { status: 500 }
    );
  }
}