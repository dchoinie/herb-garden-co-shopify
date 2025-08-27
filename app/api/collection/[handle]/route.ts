import { NextRequest, NextResponse } from 'next/server';
import { getCollectionByHandle } from '@/lib/shopify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const collection = await getCollectionByHandle(handle);
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}
