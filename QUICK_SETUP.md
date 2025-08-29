# Quick Setup Guide

## 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```bash
# Shopify Store Configuration (Server-side only)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_API_VERSION=2025-07
SHOPIFY_STOREFRONT_API_TOKEN=your_storefront_access_token_here
```

**Note**: We do NOT use `NEXT_PUBLIC_` variables for security reasons. The API token stays on the server.

## 2. Get Your Shopify Credentials

### Store Domain

- Go to your Shopify admin
- Navigate to Settings > Domains
- Copy your store domain (e.g., `my-store.myshopify.com`)

### Storefront API Token

- Go to your Shopify admin
- Navigate to Settings > Apps and sales channels > Develop apps
- Create a new app or select an existing one
- Go to API credentials
- Create a new Storefront API token
- Give it these permissions:
  - `read_products`
  - `write_carts`
  - `read_carts`

## 3. Update Your .env.local File

Replace the placeholder values with your actual credentials:

```bash
SHOPIFY_STORE_DOMAIN=my-actual-store.myshopify.com
SHOPIFY_API_VERSION=2025-07
SHOPIFY_STOREFRONT_API_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 4. Restart Your Development Server

```bash
npm run dev
```

## 5. Test the Cart

- Go to a product page
- Try adding an item to cart
- Check that the cart icon updates
- Verify cart operations work

## Security Benefits

✅ **API Token Protection** - Never exposed to browser  
✅ **Server-side Validation** - All requests validated on server  
✅ **Rate Limiting** - Can be implemented on API routes  
✅ **Error Handling** - Secure error messages

## Troubleshooting

If you see "API request failed":

1. Check that your `.env.local` file exists
2. Verify all environment variables are set
3. Restart your development server
4. Check the browser console for specific error messages

For more detailed setup instructions, see `ENVIRONMENT_SETUP.md`.
