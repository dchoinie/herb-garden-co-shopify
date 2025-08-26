import { NextRequest, NextResponse } from 'next/server';
import { customerRegister, createCustomerToken, setCustomerCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, acceptsMarketing } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const customer = await customerRegister({
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing: acceptsMarketing || false,
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create account. Email may already be in use.' },
        { status: 400 }
      );
    }

    // Create JWT token and set cookie
    const token = await createCustomerToken(customer);
    await setCustomerCookie(token);

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
