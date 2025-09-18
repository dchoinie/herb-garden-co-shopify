import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Only expose the public configuration needed for client-side Square SDK initialization
    const config = {
      applicationId: process.env.SQUARE_APPLICATION_ID,
      locationId: process.env.SQUARE_LOCATION_ID,
      environment: process.env.SQUARE_ENVIRONMENT || "sandbox",
    };

    // Validate that required config is present
    if (!config.applicationId || !config.locationId) {
      return NextResponse.json(
        { error: "Square configuration is incomplete" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error getting Square config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Square configuration",
      },
      { status: 500 }
    );
  }
}
