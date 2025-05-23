import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const MAX_HISTORY_ITEMS = 10;

export async function GET() {
  try {
    const dailyContent = await prisma.dailyContent.findFirst();

    return NextResponse.json({
      currentOffer: dailyContent?.currentOffer || "",
      currentQuote: dailyContent?.currentQuote || "",
      offerImage: dailyContent?.offerImage || "",
      quoteImage: dailyContent?.quoteImage || "",
      offers: dailyContent ? JSON.parse(dailyContent.offerHistory) : [],
      quotes: dailyContent ? JSON.parse(dailyContent.quoteHistory) : [],
    });
  } catch (error) {
    console.error("Error fetching daily content:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily content" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { type, content, image } = await request.json();

    if (!content || !type || (type !== "offer" && type !== "quote")) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get current daily content
    let dailyContent = await prisma.dailyContent.findFirst();

    // Create default if not exists
    if (!dailyContent) {
      dailyContent = await prisma.dailyContent.create({
        data: {
          currentOffer: type === "offer" ? content : "",
          currentQuote: type === "quote" ? content : "",
          offerImage: type === "offer" ? image || "" : "",
          quoteImage: type === "quote" ? image || "" : "",
          offerHistory: type === "offer" ? JSON.stringify([content]) : "[]",
          quoteHistory: type === "quote" ? JSON.stringify([content]) : "[]",
        },
      });
    } else {
      // Update the daily content based on type
      let offerHistory = JSON.parse(dailyContent.offerHistory || "[]");
      let quoteHistory = JSON.parse(dailyContent.quoteHistory || "[]");

      if (type === "offer") {
        // Add to history if not already present
        if (!offerHistory.includes(content)) {
          offerHistory = [content, ...offerHistory].slice(0, MAX_HISTORY_ITEMS);
        }

        dailyContent = await prisma.dailyContent.update({
          where: { id: dailyContent.id },
          data: {
            currentOffer: content,
            offerImage: image || dailyContent.offerImage || "",
            offerHistory: JSON.stringify(offerHistory),
          },
        });
      } else {
        // Add to history if not already present
        if (!quoteHistory.includes(content)) {
          quoteHistory = [content, ...quoteHistory].slice(0, MAX_HISTORY_ITEMS);
        }

        dailyContent = await prisma.dailyContent.update({
          where: { id: dailyContent.id },
          data: {
            currentQuote: content,
            quoteImage: image || dailyContent.quoteImage || "",
            quoteHistory: JSON.stringify(quoteHistory),
          },
        });
      }
    }

    return NextResponse.json({
      currentOffer: dailyContent.currentOffer,
      currentQuote: dailyContent.currentQuote,
      offers: JSON.parse(dailyContent.offerHistory),
      quotes: JSON.parse(dailyContent.quoteHistory),
    });
  } catch (error) {
    console.error("Error updating daily content:", error);
    return NextResponse.json(
      { error: "Failed to update daily content" },
      { status: 500 }
    );
  }
}
