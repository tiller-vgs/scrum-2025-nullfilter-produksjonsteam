import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Database error in GET /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, price, image, promotion } = body;

    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price, image, promotion },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Database error in PUT /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE product - this is the key function for delete functionality
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`DELETE /api/products/${id}: Deleting product`);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    console.log(`Product ${id} deleted successfully`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Database error in DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
