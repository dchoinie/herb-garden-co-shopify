import { NextRequest, NextResponse } from 'next/server';
import { customerLogout } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await customerLogout();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
