import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_CLIENT_ID || 
        !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      console.error('Missing Gmail OAuth2 environment variables')
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    })

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'contact@livethrough.co',
      subject: 'New LiveThrough Subscription',
      text: `New subscription from: ${email}`,
      html: `<h2>New LiveThrough Subscription</h2><p>Email: ${email}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process subscription' },
      { status: 500 }
    )
  }
} 