import * as nodemailer from 'nodemailer'

export const sender = {
  name: process.env.SMTP_SENDER_NAME!,
  email: process.env.SMTP_SENDER_EMAIL!,
}

export const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_BREVO_USER!,
    pass: process.env.SMTP_BREVO_PASS!,
  },
})

export const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_GMAIL_USER!,
    pass: process.env.SMTP_GMAIL_PASS!,
  },
})

export const transporter = brevoTransporter
