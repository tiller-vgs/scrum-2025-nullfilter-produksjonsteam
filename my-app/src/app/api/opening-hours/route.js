import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// The correct order of weekdays in Norwegian
const WEEKDAYS = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
];

export async function GET() {
  try {
    console.log("GET /api/opening-hours: Starting request");

    // Test connection
    await prisma.$connect();

    // Get all hours from DB
    let openingHours = await prisma.openingHours.findMany();

    // Check if we have all days, if not, create the missing ones
    if (openingHours.length < WEEKDAYS.length) {
      console.log("Some days are missing, creating them");

      // Find which days we already have
      const existingDays = openingHours.map((day) => day.day);

      // Create missing days
      for (const day of WEEKDAYS) {
        if (!existingDays.includes(day)) {
          const newDay = await prisma.openingHours.create({
            data: {
              day,
              hours: "Stengt", // Default to closed
            },
          });
          openingHours.push(newDay);
          console.log(`Created day: ${day}`);
        }
      }
    }

    // Sort days in correct weekday order
    openingHours.sort((a, b) => {
      return WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day);
    });

    console.log(`Returning ${openingHours.length} opening hours records`);
    return NextResponse.json(openingHours);
  } catch (error) {
    console.error("Database error in GET /api/opening-hours:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch opening hours",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Add ability to initialize or reset all opening hours
export async function POST() {
  try {
    console.log("POST /api/opening-hours: Initializing opening hours");

    // Initialize default hours for all days
    const results = [];

    for (const day of WEEKDAYS) {
      // Check if the day exists
      const existingDay = await prisma.openingHours.findFirst({
        where: { day },
      });

      if (existingDay) {
        // Update existing day
        const updated = await prisma.openingHours.update({
          where: { id: existingDay.id },
          data: {
            hours:
              day === "Lørdag" || day === "Søndag" ? "Stengt" : "09:30 - 12:00",
          },
        });
        results.push(updated);
      } else {
        // Create new day
        const created = await prisma.openingHours.create({
          data: {
            day,
            hours:
              day === "Lørdag" || day === "Søndag" ? "Stengt" : "09:30 - 12:00",
          },
        });
        results.push(created);
      }
    }

    // Sort in correct order
    results.sort((a, b) => {
      return WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day);
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Database error in POST /api/opening-hours:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize opening hours",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
