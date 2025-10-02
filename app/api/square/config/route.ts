import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox";

    // Only expose the public configuration needed for client-side Square SDK initialization
    const config = {
      applicationId: process.env.SQUARE_APPLICATION_ID,
      locationId: process.env.SQUARE_LOCATION_ID,
      environment: environment,
      // Add environment-specific configuration
      environmentConfig: {
        isSandbox: environment === "sandbox",
        isProduction: environment === "production",
      },
    };

    // Validate that required config is present
    if (!config.applicationId || !config.locationId) {
      return NextResponse.json(
        { error: "Square configuration is incomplete" },
        { status: 500 }
      );
    }

    console.log("Square config for client:", {
      applicationId: config.applicationId,
      locationId: config.locationId,
      environment: config.environment,
    });

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
