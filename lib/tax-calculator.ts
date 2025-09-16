/**
 * Comprehensive Tax Calculation System
 * Handles all US state sales tax rates plus Minnesota cannabis tax
 */

export interface TaxCalculation {
  subtotal: number;
  stateTax: number;
  stateTaxRate: number;
  cannabisTax: number;
  cannabisTaxRate: number;
  totalTax: number;
  total: number;
  currency: string;
}

export interface TaxRates {
  [stateCode: string]: number;
}

// US State Sales Tax Rates
export const STATE_TAX_RATES: TaxRates = {
  AL: 4.0,
  AK: 0.0,
  AZ: 5.6,
  AR: 6.5,
  CA: 7.25,
  CO: 2.9,
  CT: 6.35,
  DE: 0.0,
  FL: 6.0,
  GA: 4.0,
  HI: 4.0,
  ID: 6.0,
  IL: 6.25,
  IN: 7.0,
  IA: 6.0,
  KS: 6.5,
  KY: 6.0,
  LA: 4.45,
  ME: 5.5,
  MD: 6.0,
  MA: 6.25,
  MI: 6.0,
  MN: 6.875,
  MS: 7.0,
  MO: 4.225,
  MT: 0.0,
  NE: 5.5,
  NV: 6.85,
  NH: 0.0,
  NJ: 6.625,
  NM: 5.125,
  NY: 4.0,
  NC: 4.75,
  ND: 5.0,
  OH: 5.75,
  OK: 4.5,
  OR: 0.0,
  PA: 6.0,
  RI: 7.0,
  SC: 6.0,
  SD: 4.5,
  TN: 7.0,
  TX: 6.25,
  UT: 4.7,
  VT: 6.0,
  VA: 4.3,
  WA: 6.5,
  WV: 6.0,
  WI: 5.0,
  WY: 4.0,
};

// Minnesota Cannabis/Hemp Tax Rate
export const MINNESOTA_CANNABIS_TAX_RATE = 15.0; // 15%

/**
 * Calculate comprehensive tax for an order
 */
export function calculateTax(
  subtotal: number,
  stateCode: string,
  currency: string = "USD"
): TaxCalculation {
  const stateTaxRate = STATE_TAX_RATES[stateCode] || 0;
  const stateTax = (subtotal * stateTaxRate) / 100;

  // Minnesota gets additional cannabis tax
  const isMinnesota = stateCode === "MN";
  const cannabisTaxRate = isMinnesota ? MINNESOTA_CANNABIS_TAX_RATE : 0;
  const cannabisTax = isMinnesota ? (subtotal * cannabisTaxRate) / 100 : 0;

  const totalTax = stateTax + cannabisTax;
  const total = subtotal + totalTax;

  return {
    subtotal,
    stateTax,
    stateTaxRate,
    cannabisTax,
    cannabisTaxRate,
    totalTax,
    total,
    currency,
  };
}

/**
 * Get state name from state code
 */
export function getStateName(stateCode: string): string {
  const stateNames: { [key: string]: string } = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  return stateNames[stateCode] || stateCode;
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Get tax breakdown for display
 */
export function getTaxBreakdown(
  calculation: TaxCalculation,
  stateCode?: string
): Array<{
  label: string;
  amount: number;
  rate: number;
  formatted: string;
}> {
  const breakdown = [];

  // State tax
  if (calculation.stateTax > 0) {
    const stateName = stateCode ? getStateName(stateCode) : "State";
    breakdown.push({
      label: `${stateName} Sales Tax`,
      amount: calculation.stateTax,
      rate: calculation.stateTaxRate,
      formatted: formatCurrency(calculation.stateTax, calculation.currency),
    });
  }

  // Cannabis tax (Minnesota only)
  if (calculation.cannabisTax > 0) {
    breakdown.push({
      label: "Minnesota Cannabis/Hemp Tax",
      amount: calculation.cannabisTax,
      rate: calculation.cannabisTaxRate,
      formatted: formatCurrency(calculation.cannabisTax, calculation.currency),
    });
  }

  return breakdown;
}
