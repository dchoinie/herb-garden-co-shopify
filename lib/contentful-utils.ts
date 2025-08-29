import { 
  getContentfulClient, 
  ContentfulEntry, 
  ContentfulAsset,
  getAssetUrl 
} from './contentful';

// Generic function to fetch entries by content type
export async function getEntriesByType<T = any>(
  contentType: string,
  options: {
    preview?: boolean;
    limit?: number;
    skip?: number;
    order?: string;
    select?: string[];
    where?: Record<string, any>;
  } = {}
): Promise<ContentfulEntry<T>[]> {
  const client = getContentfulClient(options.preview);
  
  try {
    const response = await client.getEntries<T>({
      content_type: contentType,
      limit: options.limit || 100,
      skip: options.skip || 0,
      order: options.order,
      select: options.select,
      ...options.where,
    });

    return response.items;
  } catch (error) {
    console.error(`Error fetching ${contentType} entries:`, error);
    throw error;
  }
}

// Function to fetch a single entry by ID
export async function getEntryById<T = any>(
  entryId: string,
  options: { preview?: boolean } = {}
): Promise<ContentfulEntry<T> | null> {
  const client = getContentfulClient(options.preview);
  
  try {
    const response = await client.getEntry<T>(entryId);
    return response;
  } catch (error) {
    console.error(`Error fetching entry ${entryId}:`, error);
    return null;
  }
}

// Function to fetch entries by slug
export async function getEntryBySlug<T = any>(
  contentType: string,
  slug: string,
  options: { preview?: boolean } = {}
): Promise<ContentfulEntry<T> | null> {
  const client = getContentfulClient(options.preview);
  
  try {
    const response = await client.getEntries<T>({
      content_type: contentType,
      'fields.slug': slug,
      limit: 1,
    });

    return response.items[0] || null;
  } catch (error) {
    console.error(`Error fetching ${contentType} with slug ${slug}:`, error);
    return null;
  }
}

// Function to fetch assets
export async function getAssets(options: {
  preview?: boolean;
  limit?: number;
  skip?: number;
  order?: string;
} = {}): Promise<ContentfulAsset[]> {
  const client = getContentfulClient(options.preview);
  
  try {
    const response = await client.getAssets({
      limit: options.limit || 100,
      skip: options.skip || 0,
      order: options.order,
    });

    return response.items;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

// Function to get asset by ID
export async function getAssetById(
  assetId: string,
  options: { preview?: boolean } = {}
): Promise<ContentfulAsset | null> {
  const client = getContentfulClient(options.preview);
  
  try {
    const response = await client.getAsset(assetId);
    return response;
  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error);
    return null;
  }
}

// Helper function to extract rich text content
export function extractRichTextContent(richText: any): string {
  if (!richText || !richText.content) return '';
  
  return richText.content
    .map((node: any) => {
      if (node.nodeType === 'paragraph') {
        return node.content
          .map((content: any) => content.value || '')
          .join('');
      }
      return '';
    })
    .join('\n')
    .trim();
}

// Helper function to get image dimensions from asset
export function getImageDimensions(asset: ContentfulAsset): { width: number; height: number } | null {
  if (asset.fields.file.details?.image) {
    return {
      width: asset.fields.file.details.image.width,
      height: asset.fields.file.details.image.height,
    };
  }
  return null;
}

// Helper function to create responsive image srcset
export function createImageSrcSet(asset: ContentfulAsset, widths: number[] = [400, 800, 1200]): string {
  return widths
    .map(width => `${getAssetUrl(asset)}?w=${width} ${width}w`)
    .join(', ');
}

// Helper function to validate environment variables
export function validateContentfulConfig(): boolean {
  const required = [
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ACCESS_TOKEN',
    'CONTENTFUL_PREVIEW_ACCESS_TOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required Contentful environment variables:', missing);
    return false;
  }
  
  return true;
}
