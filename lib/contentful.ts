import { createClient } from 'contentful';

// Environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const deliveryAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

if (!spaceId || !deliveryAccessToken || !previewAccessToken) {
  throw new Error(
    'Please define CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, and CONTENTFUL_PREVIEW_ACCESS_TOKEN environment variables'
  );
}

// Delivery client (for published content)
export const contentfulClient = createClient({
  space: spaceId,
  accessToken: deliveryAccessToken,
});

// Preview client (for draft content)
export const contentfulPreviewClient = createClient({
  space: spaceId,
  accessToken: previewAccessToken,
  host: 'preview.contentful.com',
});

// Helper function to get the appropriate client based on preview mode
export function getContentfulClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient;
}

// Type definitions for common Contentful fields
export interface ContentfulAsset {
  sys: {
    id: string;
    type: 'Asset';
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface ContentfulEntry<T = any> {
  sys: {
    id: string;
    type: 'Entry';
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: string;
      };
    };
  };
  fields: T;
}

// Helper function to extract asset URLs
export function getAssetUrl(asset: ContentfulAsset): string {
  return `https:${asset.fields.file.url}`;
}

// Helper function to get responsive image URLs
export function getResponsiveImageUrl(asset: ContentfulAsset, width?: number): string {
  const baseUrl = getAssetUrl(asset);
  if (width) {
    return `${baseUrl}?w=${width}&h=${width}&fit=fill`;
  }
  return baseUrl;
}
