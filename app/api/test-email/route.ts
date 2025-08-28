import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log("Environment check:");
    console.log("- RESEND_API_KEY:", resendApiKey ? "✅ Set" : "❌ Missing");
    console.log("- RESEND_FROM_EMAIL:", fromEmail);
    console.log("- NEXT_PUBLIC_BASE_URL:", baseUrl);

    if (!resendApiKey) {
      return NextResponse.json(
        {
          error: "RESEND_API_KEY environment variable is not set",
          instructions:
            "Please add RESEND_API_KEY=your_api_key to your .env file",
        },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Test Resend email sending
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    console.log("Attempting to send test email to:", email);

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Test Email - Herb Garden Email Verification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email - Herb Garden</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌿 Test Email - Herb Garden</h1>
          </div>
          <div class="content">
            <h2>Email Verification Test</h2>
            <p>This is a test email to verify that your Resend email service is working correctly.</p>
            <p>If you received this email, your email verification system is properly configured!</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>From: ${fromEmail}</li>
              <li>To: ${email}</li>
              <li>Sent at: ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 Herb Garden. All rights reserved.</p>
            <p>This is a test email sent to ${email}</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Test email sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result: result,
      environment: {
        resendApiKey: resendApiKey ? "✅ Set" : "❌ Missing",
        fromEmail,
        baseUrl,
      },
    });
  } catch (error) {
    console.error("Test email error:", error);

    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
        instructions: "Check your Resend API key and domain verification",
      },
      { status: 500 }
    );
  }
}
