import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Create lead object
    const lead = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString()
    };

    // Log the lead
    console.log('✅ New lead received:', lead);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Thank you! We'll contact you within 24 hours.",
      leadId: lead.id
    });

  } catch (error) {
    console.error('❌ Error processing lead:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Leads API is working!',
    timestamp: new Date().toISOString()
  });
}