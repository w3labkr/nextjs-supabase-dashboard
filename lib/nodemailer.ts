import * as nodemailer from 'nodemailer'

const sender = {
  name: process.env.SMTP_SENDER_NAME!,
  email: process.env.SMTP_SENDER_EMAIL!,
}

const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_BREVO_USER!,
    pass: process.env.SMTP_BREVO_PASS!,
  },
})

const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_GMAIL_USER!,
    pass: process.env.SMTP_GMAIL_PASS!,
  },
})

const transporter = brevoTransporter

export { sender, brevoTransporter, gmailTransporter, transporter }
