import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_EsAEFai6_PqpFbySt7oTUHPWuCcYQnkUP');

interface SendEmailRequest {
  to: string;
  subject: string;
  replyTo?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: SendEmailRequest = await req.json();

    const response = await resend.emails.send({
      from: 'BrainMap Contact <onboarding@resend.dev>',
      to: data.to,
      subject: data.subject,
      replyTo: data.replyTo,
      html: data.message,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (err: any) {
    console.error('Error sending email:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
