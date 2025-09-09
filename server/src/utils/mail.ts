import nodemailer from "nodemailer"

import logger from "./logger"

// SMTP configuration
const smtpHost = process.env.SMTP_HOST || ''
const smtpPort = process.env.SMTP_PORT || '587'
const smtpUser = process.env.SMTP_USER || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: Number(smtpPort),
  secure: true, // Always secure connection
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export const sendMail = async (to: string, subject: string, body: string): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: smtpUser,
      to: to,
      subject: subject,
      text: body,
      html: body,
    });

    return Boolean(info.messageId)
  } catch (error) {
    logger.error(error)
    return false
  }
}
