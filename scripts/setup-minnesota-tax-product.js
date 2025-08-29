/**
 * Script to set up Minnesota Tax product in Shopify
 *
 * This script helps create a custom product in Shopify that can be used
 * as a line item for Minnesota hemp/cannabis tax calculations.
 *
 * To use this script:
 * 1. Create a new product in your Shopify admin with the following details:
 *    - Title: "Minnesota Hemp/Cannabis Tax"
 *    - Description: "15% tax applied to hemp/cannabis products shipped to Minnesota"
 *    - Price: $0.00 (this will be dynamically calculated)
 *    - SKU: "MN-TAX-001"
 *    - Product type: "Tax"
 *    - Vendor: "System"
 *    - Inventory: Track quantity (set to 999999)
 *    - Weight: 0
 *    - Requires shipping: No
 *    - Taxable: No
 *
 * 2. After creating the product, get its variant ID and update the
 *    MINNESOTA_TAX_VARIANT_ID constant in lib/minnesota-tax.ts
 *
 * 3. The product should be hidden from collections and search results
 */

console.log(`
Minnesota Tax Product Setup Instructions:

1. Go to your Shopify admin panel
2. Navigate to Products > Add product
3. Create a product with these settings:

   Basic Information:
   - Title: "Minnesota Hemp/Cannabis Tax"
   - Description: "15% tax applied to hemp/cannabis products shipped to Minnesota"
   - Media: No images needed
   
   Pricing:
   - Price: $0.00
   - Compare at price: Leave empty
   - Cost per item: $0.00
   
   Inventory:
   - SKU: "MN-TAX-001"
   - Barcode: Leave empty
   - Track quantity: Yes
   - Quantity: 999999
   - Allow customers to purchase when out of stock: No
   
   Shipping:
   - Weight: 0
   - Requires shipping: No
   - Harmonized System (HS) code: Leave empty
   
   Variants:
   - Default variant is fine
   
   Organization:
   - Product type: "Tax"
   - Vendor: "System"
   - Collections: Don't add to any collections
   - Tags: "tax", "minnesota", "hemp", "cannabis"
   
   Search engine listing preview:
   - Page title: "Minnesota Hemp/Cannabis Tax"
   - Meta description: "Tax calculation for Minnesota hemp/cannabis products"
   - URL and handle: "minnesota-hemp-cannabis-tax"
   
   Sales channels and apps:
   - Online Store: Disable (hide from storefront)
   - Point of sale: Disable
   - Other channels: Disable as needed

4. After creating the product, go to the product page and copy the variant ID
   from the URL or from the product details

5. Update the MINNESOTA_TAX_VARIANT_ID constant in lib/minnesota-tax.ts
   with the actual variant ID

6. Test the implementation by adding items to cart and entering a Minnesota address
`);

// This is a placeholder for the actual variant ID
// Replace this with the real variant ID from your Shopify admin
const MINNESOTA_TAX_VARIANT_ID =
  "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE";

console.log(`
Example variant ID format: ${MINNESOTA_TAX_VARIANT_ID}

Once you have the real variant ID, update the lib/minnesota-tax.ts file.
`);
