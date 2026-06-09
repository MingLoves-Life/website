import { NextResponse } from 'next/server';
import { getResend } from '../../../lib/resend';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, birthdate, birthtime, service, message } = body;

  if (!name || !email || !birthdate || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await getResend().emails.send({
      from: 'Destiny Site <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL || 'hello@example.com',
      subject: `New Consultation Request: ${service} - ${name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Birth Date:</strong> ${birthdate}</p>
        <p><strong>Birth Time:</strong> ${birthtime || 'Not provided'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send failed:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
