import { NextRequest, NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';
import { validateContentfulConfig } from '@/lib/contentful-utils';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!validateContentfulConfig()) {
      return NextResponse.json(
        { error: 'Contentful configuration is missing' },
        { status: 500 }
      );
    }

    // Test the connection by fetching space info
    const space = await contentfulClient.getSpace();
    
    // Get content types to show what's available
    const contentTypes = await contentfulClient.getContentTypes();
    
    // Get a sample of entries (limit to 5)
    const entries = await contentfulClient.getEntries({ limit: 5 });

    return NextResponse.json({
      success: true,
      space: {
        id: space.sys.id,
        name: space.name,
        locales: space.locales,
      },
      contentTypes: contentTypes.items.map(ct => ({
        id: ct.sys.id,
        name: ct.name,
        description: ct.description,
      })),
      sampleEntries: entries.items.map(entry => ({
        id: entry.sys.id,
        contentType: entry.sys.contentType.sys.id,
        title: entry.fields.title || entry.fields.name || 'No title',
        updatedAt: entry.sys.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Contentful test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Contentful',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
