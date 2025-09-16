import { NextRequest, NextResponse } from "next/server";
import {
  calculateTax,
  getTaxBreakdown,
  formatCurrency,
} from "@/lib/tax-calculator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subtotal = parseFloat(searchParams.get("subtotal") || "25.00");
    const stateCode = searchParams.get("state") || "MN";

    // Calculate tax
    const taxCalculation = calculateTax(subtotal, stateCode);
    const taxBreakdown = getTaxBreakdown(taxCalculation, stateCode);

    return NextResponse.json({
      success: true,
      input: {
        subtotal,
        stateCode,
      },
      calculation: {
        ...taxCalculation,
        formatted: {
          subtotal: formatCurrency(taxCalculation.subtotal),
          stateTax: formatCurrency(taxCalculation.stateTax),
          cannabisTax: formatCurrency(taxCalculation.cannabisTax),
          totalTax: formatCurrency(taxCalculation.totalTax),
          total: formatCurrency(taxCalculation.total),
        },
      },
      breakdown: taxBreakdown,
      message: `Tax calculated for ${stateCode}: ${formatCurrency(
        taxCalculation.totalTax
      )} total tax on ${formatCurrency(subtotal)} subtotal`,
    });
  } catch (error) {
    console.error("Error calculating tax:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate tax",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
