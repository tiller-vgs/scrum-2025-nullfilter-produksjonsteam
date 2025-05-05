import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
  try {
    // Test connection first
    await prisma.$connect();

    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Database error in GET /api/products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, image, promotion } = body;

    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Test connection first
    await prisma.$connect();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        promotion: promotion || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Database error in POST /api/products:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
