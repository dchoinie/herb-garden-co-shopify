# Custom Checkout System with Square Integration

This document describes the custom checkout flow implementation using Square's Checkout API, integrated with custom tax calculation for Minnesota cannabis products.

## Overview

The checkout system provides a complete e-commerce solution with:

- Square catalog product integration
- Custom cart management
- State-specific tax calculation (including Minnesota cannabis tax)
- Square Checkout API integration
- Order confirmation and tracking

## Architecture

### Components

1. **Cart Service** (`lib/cart-service.ts`)

   - Manages cart state and operations
   - Integrates with tax calculation
   - Handles cart persistence

2. **Cart Context** (`lib/cart-context.tsx`)

   - React context for cart state management
   - Provides cart operations to components
   - Handles localStorage persistence

3. **Tax Calculator** (`lib/tax-calculator.ts`)

   - Calculates state sales tax for all US states
   - Applies Minnesota cannabis tax (15%) for MN orders
   - Provides tax breakdown for display

4. **Square Integration** (`lib/square.ts`)
   - Square API client configuration
   - Handles catalog and checkout operations

### Pages

1. **Shop Page** (`app/(public)/shop/page.tsx`)

   - Displays Square catalog products
   - Product cards with add to cart functionality

2. **Cart Page** (`app/(public)/cart/page.tsx`)

   - Shows cart items with quantity management
   - Tax calculation by state
   - Order summary with totals

3. **Checkout Page** (`app/(public)/checkout/page.tsx`)

   - Address collection (shipping and billing)
   - Order summary with tax breakdown
   - Integration with Square Checkout API

4. **Success Page** (`app/(public)/checkout/success/page.tsx`)
   - Order confirmation
   - Order details display

### API Routes

1. **Checkout Creation** (`app/api/checkout/create/route.ts`)

   - Creates Square order with custom tax
   - Generates Square Checkout payment link
   - Handles address and tax information

2. **Square Webhooks** (`app/api/webhooks/square/route.ts`)
   - Processes Square webhook notifications
   - Handles payment and order updates

## Tax Calculation

The system implements a comprehensive tax calculation system:

### State Sales Tax

- All 50 US states supported
- Rates range from 0% (Alaska, Delaware, Montana, New Hampshire, Oregon) to 7.25% (California)

### Minnesota Cannabis Tax

- Additional 15% tax for Minnesota orders
- Applied to subtotal (same as state sales tax)
- Only applies to Minnesota (MN) state code

### Tax Breakdown Display

- Shows individual tax components
- Displays rates and amounts
- Updates in real-time based on state selection

## Square Integration

### Checkout API Features

- Square-hosted checkout pages
- Support for multiple payment methods (cards, digital wallets)
- Custom fields for special instructions
- Tipping support
- Mobile-optimized checkout experience

### Order Creation

- Creates Square orders with line items
- Applies custom tax calculations
- Includes shipping address information
- Handles tax line items for state and cannabis taxes

### Payment Processing

- Secure payment processing through Square
- Automatic tax calculation on Square's side
- Webhook notifications for order updates
- Order confirmation and tracking

## Usage

### Adding Products to Cart

```tsx
import { useCart } from "@/lib/cart-context";

const { addToCart } = useCart();

// Add product to cart
await addToCart(productId, quantity);
```

### Tax Calculation

```tsx
import { calculateTax } from "@/lib/tax-calculator";

const taxCalculation = calculateTax(subtotal, "MN", "USD");
// Returns: { subtotal, stateTax, cannabisTax, total, ... }
```

### Cart Operations

```tsx
const { cart, updateQuantity, removeFromCart, calculateTotals } = useCart();

// Update item quantity
await updateQuantity(itemId, newQuantity);

// Calculate tax for specific state
await calculateTotals("MN");
```

## Environment Variables

Required environment variables:

```env
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox # or production
SQUARE_LOCATION_ID=your_location_id
SQUARE_WEBHOOK_SECRET=your_webhook_secret
SQUARE_MERCHANT_EMAIL=your_merchant_email
NEXT_PUBLIC_BASE_URL=your_base_url
```

## Features

### Cart Management

- Add/remove items
- Quantity updates
- Persistent cart (localStorage)
- Real-time updates

### Tax Calculation

- State-specific sales tax
- Minnesota cannabis tax
- Real-time calculation
- Tax breakdown display

### Checkout Flow

- Address collection
- Tax calculation
- Square Checkout integration
- Order confirmation

### UI Components

- Product cards with add to cart
- Cart page with item management
- Checkout form with validation
- Order confirmation page
- Cart icon with item count

## Security

- Webhook signature verification
- Secure payment processing through Square
- Input validation and sanitization
- HTTPS required for production

## Testing

The system can be tested using Square's sandbox environment:

1. Set `SQUARE_ENVIRONMENT=sandbox`
2. Use Square sandbox test cards
3. Test tax calculation with different states
4. Verify webhook processing

## Future Enhancements

- Order history and tracking
- Customer accounts
- Inventory management
- Advanced tax rules
- Multi-location support
- Analytics and reporting
