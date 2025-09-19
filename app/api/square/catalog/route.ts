import { NextRequest, NextResponse } from "next/server";
import { squareCatalogService } from "@/lib/square-catalog";

export async function GET(request: NextRequest) {
  try {
    const objects = await squareCatalogService.getAllProducts();

    // Ensure objects is an array
    const objectsArray = Array.isArray(objects) ? objects : [];

    // Recursive function to convert all BigInt values to numbers
    const convertBigInts = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;

      if (typeof obj === "bigint") {
        return Number(obj);
      }

      if (Array.isArray(obj)) {
        return obj.map(convertBigInts);
      }

      if (typeof obj === "object") {
        const converted: any = {};
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertBigInts(value);
        }
        return converted;
      }

      return obj;
    };

    // Convert BigInt values to numbers to avoid serialization errors
    const serializedObjects = objectsArray.map(convertBigInts);

    return NextResponse.json({
      success: true,
      data: {
        objects: serializedObjects,
        totalItems: serializedObjects.length,
      },
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
