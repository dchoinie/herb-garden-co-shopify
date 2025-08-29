# Contentful CMS Setup

This guide will help you set up Contentful CMS integration for your Next.js application.

## Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_content_preview_api_token_here
```

## Getting Your Contentful Credentials

1. **Space ID**: Go to your Contentful space settings → General Settings → Space ID
2. **Content Delivery API Token**: Go to Settings → API keys → Create API key → Copy the "Content Delivery API - access token"
3. **Content Preview API Token**: Go to Settings → API keys → Create API key → Copy the "Content Preview API - access token"

## Installation

Install the Contentful SDK:

```bash
npm install contentful
```

## Testing the Connection

1. **API Test**: Visit `/api/contentful/test` to test the API connection
2. **Page Test**: Visit `/contentful-test` to see a visual test of the integration

## Usage Examples

### Using the Custom Hooks

```tsx
import { useContentfulEntries } from '@/hooks/use-contentful';

function MyComponent() {
  const { data, loading, error } = useContentfulEntries('blogPost', {
    limit: 10,
    order: '-sys.createdAt'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(post => (
        <div key={post.sys.id}>
          <h2>{post.fields.title}</h2>
          <p>{post.fields.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Utility Functions

```tsx
import { getEntriesByType, getEntryBySlug } from '@/lib/contentful-utils';

// In a server component or API route
const posts = await getEntriesByType('blogPost', { limit: 5 });
const singlePost = await getEntryBySlug('blogPost', 'my-post-slug');
```

### Using the Contentful Client Directly

```tsx
import { contentfulClient } from '@/lib/contentful';

const entries = await contentfulClient.getEntries({
  content_type: 'blogPost',
  limit: 10
});
```

## Available Utilities

### Hooks (`hooks/use-contentful.ts`)
- `useContentfulEntries()` - Fetch multiple entries by content type
- `useContentfulEntry()` - Fetch a single entry by ID
- `useContentfulEntryBySlug()` - Fetch a single entry by slug

### Utility Functions (`lib/contentful-utils.ts`)
- `getEntriesByType()` - Server-side function to fetch entries
- `getEntryById()` - Server-side function to fetch by ID
- `getEntryBySlug()` - Server-side function to fetch by slug
- `getAssets()` - Fetch assets
- `getAssetById()` - Fetch asset by ID
- `extractRichTextContent()` - Extract text from rich text fields
- `getImageDimensions()` - Get image dimensions from asset
- `createImageSrcSet()` - Create responsive image srcset
- `validateContentfulConfig()` - Validate environment variables

### Helper Functions (`lib/contentful.ts`)
- `getAssetUrl()` - Get full URL for an asset
- `getResponsiveImageUrl()` - Get responsive image URL with parameters

## Content Types

The integration is designed to work with any content type. You'll need to create TypeScript interfaces for your specific content types:

```tsx
interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content?: any;
  featuredImage?: any;
  author?: string;
  publishDate?: string;
}

// Then use it with the hooks
const { data } = useContentfulEntries<BlogPost>('blogPost');
```

## Preview Mode

To enable preview mode (for draft content), pass `preview: true` to the functions:

```tsx
const { data } = useContentfulEntries('blogPost', { preview: true });
```

## Error Handling

The integration includes comprehensive error handling:
- Environment variable validation
- API connection error handling
- Graceful fallbacks for missing content
- Loading states for better UX

## Next Steps

1. Add your environment variables to `.env.local`
2. Install the contentful package: `npm install contentful`
3. Test the connection at `/api/contentful/test`
4. Create content types in your Contentful space
5. Add content to test the integration
6. Customize the components and hooks for your specific needs
