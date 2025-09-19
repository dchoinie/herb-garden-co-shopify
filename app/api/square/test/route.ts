import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/square";

export async function GET(request: NextRequest) {
  try {
    // Test basic client properties
    const clientInfo = {
      environment: process.env.SQUARE_ENVIRONMENT,
      hasToken: !!process.env.SQUARE_ACCESS_TOKEN,
      clientType: typeof client,
      clientProperties: Object.keys(client),
      tokenLength: process.env.SQUARE_ACCESS_TOKEN?.length || 0,
    };

    return NextResponse.json({
      success: true,
      message: "Square client created successfully",
      clientInfo,
    });
  } catch (error) {
    console.error("Error testing Square client:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
