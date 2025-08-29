export interface MinnesotaTaxInfo {
  isMinnesota: boolean;
  taxAmount: string;
  taxPercentage: number;
}

export const MINNESOTA_TAX_RATE = 0.15; // 15%
export const MINNESOTA_STATE_CODE = "MN";

/**
 * Check if a shipping address is in Minnesota
 */
export function isMinnesotaAddress(shippingAddress: {
  province?: string;
  provinceCode?: string;
  country?: string;
  countryCode?: string;
}): boolean {
  if (!shippingAddress) return false;
  
  // Check if the address is in Minnesota
  return (
    shippingAddress.provinceCode === MINNESOTA_STATE_CODE ||
    shippingAddress.province === "Minnesota" ||
    (shippingAddress.provinceCode === "MN" && shippingAddress.countryCode === "US")
  );
}

/**
 * Calculate Minnesota hemp/cannabis tax amount
 */
export function calculateMinnesotaTax(subtotalAmount: string): string {
  const subtotal = parseFloat(subtotalAmount);
  if (isNaN(subtotal) || subtotal <= 0) return "0.00";
  
  const taxAmount = subtotal * MINNESOTA_TAX_RATE;
  return taxAmount.toFixed(2);
}

/**
 * Get Minnesota tax information from cart attributes
 */
export function getMinnesotaTaxFromCart(cart: any): MinnesotaTaxInfo | null {
  if (!cart?.attributes) return null;

  const taxEligibleAttr = cart.attributes.find((attr: any) => attr.key === "minnesota_tax_eligible");
  const taxAmountAttr = cart.attributes.find((attr: any) => attr.key === "minnesota_tax_amount");
  const taxRateAttr = cart.attributes.find((attr: any) => attr.key === "minnesota_tax_rate");

  if (!taxEligibleAttr || taxEligibleAttr.value !== "true") {
    return null;
  }

  return {
    isMinnesota: true,
    taxAmount: taxAmountAttr?.value || "0.00",
    taxPercentage: parseFloat(taxRateAttr?.value || "15")
  };
}

/**
 * Update Minnesota tax via API
 */
export async function updateMinnesotaTaxViaAPI(
  cartId: string,
  shippingAddress?: any
): Promise<any> {
  try {
    const response = await fetch("/api/cart/minnesota-tax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        shippingAddress
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Minnesota tax:", error);
    throw error;
  }
}
