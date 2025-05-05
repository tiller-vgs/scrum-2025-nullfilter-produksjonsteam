import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileExt = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;

    // Save to public/uploads dir so it's accessible via URL
    const relativePath = `/uploads/${fileName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const fullPath = path.join(uploadDir, fileName);

    // Ensure directory exists
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file
    await writeFile(fullPath, buffer);
    console.log(`Uploaded file saved to ${fullPath}`);

    return NextResponse.json({ success: true, filePath: relativePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}
