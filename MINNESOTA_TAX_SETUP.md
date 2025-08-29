# Minnesota Hemp/Cannabis Tax Implementation

This implementation adds a 15% hemp/cannabis tax for customers shipping to Minnesota addresses. The tax is calculated on the cart subtotal and added as a custom line item.

## Features

- **Automatic Detection**: Detects Minnesota shipping addresses
- **Dynamic Calculation**: Calculates 15% tax on cart subtotal
- **Visual Feedback**: Shows tax information in cart and checkout
- **Real-time Updates**: Tax updates automatically when address changes

## Setup Instructions

### 1. Create Minnesota Tax Product in Shopify

1. Go to your Shopify admin panel
2. Navigate to **Products** > **Add product**
3. Create a product with these settings:

   **Basic Information:**

   - Title: "Minnesota Hemp/Cannabis Tax"
   - Description: "15% tax applied to hemp/cannabis products shipped to Minnesota"
   - Media: No images needed

   **Pricing:**

   - Price: $0.00
   - Compare at price: Leave empty
   - Cost per item: $0.00

   **Inventory:**

   - SKU: "MN-TAX-001"
   - Barcode: Leave empty
   - Track quantity: Yes
   - Quantity: 999999
   - Allow customers to purchase when out of stock: No

   **Shipping:**

   - Weight: 0
   - Requires shipping: No
   - Harmonized System (HS) code: Leave empty

   **Variants:**

   - Default variant is fine

   **Organization:**

   - Product type: "Tax"
   - Vendor: "System"
   - Collections: Don't add to any collections
   - Tags: "tax", "minnesota", "hemp", "cannabis"

   **Search engine listing preview:**

   - Page title: "Minnesota Hemp/Cannabis Tax"
   - Meta description: "Tax calculation for Minnesota hemp/cannabis products"
   - URL and handle: "minnesota-hemp-cannabis-tax"

   **Sales channels and apps:**

   - Online Store: **Disable** (hide from storefront)
   - Point of sale: Disable
   - Other channels: Disable as needed

### 2. Get the Product Variant ID

1. After creating the product, go to the product page in your Shopify admin
2. Copy the variant ID from the URL or product details
3. The variant ID format will be: `gid://shopify/ProductVariant/XXXXXXXXXX`

### 3. Update the Configuration

1. Open `lib/minnesota-tax.ts`
2. Find the line: `export const MINNESOTA_TAX_VARIANT_ID = "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE";`
3. Replace `YOUR_VARIANT_ID_HERE` with the actual variant ID from step 2

### 4. Test the Implementation

1. Add items to your cart
2. Go to the cart page
3. Fill in a Minnesota shipping address
4. Verify that the "Hemp/Canna Tax (15%)" line item appears
5. Test with non-Minnesota addresses to ensure tax is not applied

## How It Works

### Tax Calculation

- Tax rate: 15% of cart subtotal
- Applied only to Minnesota shipping addresses
- Calculated in real-time as address changes

### Implementation Details

- Uses Shopify cart attributes to track tax eligibility
- Adds/removes tax line items dynamically
- Integrates with existing cart functionality
- Shows tax information in cart display

### Files Modified/Created

- `lib/minnesota-tax.ts` - Core tax calculation logic
- `app/api/cart/minnesota-tax/route.ts` - API endpoint for tax updates
- `components/shipping-address-form.tsx` - Address input with tax detection
- `components/cart.tsx` - Updated to show tax information
- `app/(public)/cart/page.tsx` - Updated layout to include address form
- `lib/cart-service.ts` - Updated to include cart attributes
- `lib/cart-service-client.ts` - Updated types for cart attributes

## API Endpoints

### POST /api/cart/minnesota-tax

Updates Minnesota tax based on shipping address.

**Request Body:**

```json
{
  "cartId": "gid://shopify/Cart/...",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Minneapolis",
    "province": "Minnesota",
    "provinceCode": "MN",
    "country": "United States",
    "countryCode": "US",
    "zip": "55401"
  }
}
```

**Response:**

```json
{
  "cart": {
    /* updated cart object */
  },
  "minnesotaTax": {
    "isMinnesota": true,
    "taxAmount": "15.00",
    "taxPercentage": 15
  }
}
```

### GET /api/cart/minnesota-tax?cartId=...

Gets current Minnesota tax information for a cart.

## Cart Display

The cart now shows:

- Subtotal (before tax)
- Hemp/Canna Tax (15%) - only for Minnesota addresses
- Total (including tax)

## Shipping Address Form

The shipping address form:

- Automatically detects Minnesota addresses
- Shows tax notice for Minnesota
- Triggers tax calculation when address changes
- Provides real-time feedback

## Troubleshooting

### Tax Not Appearing

1. Verify the variant ID is correct in `lib/minnesota-tax.ts`
2. Check that the Minnesota Tax product is created in Shopify
3. Ensure the product is not visible in the storefront
4. Check browser console for any errors

### Tax Appearing for Non-Minnesota Addresses

1. Verify the address detection logic in `isMinnesotaAddress()`
2. Check that the state code is being passed correctly

### API Errors

1. Check that all environment variables are set
2. Verify Shopify API permissions
3. Check the API response for specific error messages

## Legal Considerations

- Ensure compliance with Minnesota state tax laws
- Verify that your products are subject to this tax
- Consider consulting with a tax professional
- Update your terms of service and privacy policy as needed

## Future Enhancements

- Support for other state-specific taxes
- Tax exemption handling
- Integration with Shopify's native tax system
- Webhook-based tax updates
- Tax reporting and analytics
