import nodemailer from "nodemailer"
import User from "../models/User.js"

// Check if email is configured
const isEmailConfigured = () => {
  const configured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
  if (!configured) {
    console.log("📧 Email credentials status:")
    console.log("  EMAIL_USER:", process.env.EMAIL_USER || "❌ Not set")
    console.log("  EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Not set")
  }
  return configured
}

let transporter = null

// Create transporter only if credentials are available
const getTransporter = () => {
  if (!transporter && isEmailConfigured()) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendStudyBlockEmail(userId, studyBlock, action) {
  try {
    if (!isEmailConfigured()) {
      console.log("⚠️  Email credentials not configured. Skipping email notification.")
      console.log("💡 To enable emails, set EMAIL_USER and EMAIL_PASSWORD in backend/.env")
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      console.log("❌ User not found for email notification")
      return
    }

    const startTime = new Date(studyBlock.startTime).toLocaleString()
    const endTime = new Date(studyBlock.endTime).toLocaleString()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Study Block ${action === "created" ? "Created" : "Updated"}: ${studyBlock.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Study Block ${action === "created" ? "Created" : "Updated"}</h2>
          <p><strong>Title:</strong> ${studyBlock.title}</p>
          <p><strong>Subject:</strong> ${studyBlock.subject || "N/A"}</p>
          <p><strong>Start:</strong> ${startTime}</p>
          <p><strong>End:</strong> ${endTime}</p>
          <p><strong>Description:</strong> ${studyBlock.description || "N/A"}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from MagicSlides Study Blocks.
          </p>
        </div>
      `,
    }

    const emailTransporter = getTransporter()
    if (!emailTransporter) {
      console.log("❌ Failed to create email transporter")
      return
    }

    await emailTransporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${user.email}: Study block ${action}`)
  } catch (error) {
    console.error("❌ Email sending error:", error.message)
    if (error.message.includes("Invalid login")) {
      console.log("💡 Check your EMAIL_USER and EMAIL_PASSWORD in backend/.env")
      console.log("💡 For Gmail, you need an App Password: https://myaccount.google.com/apppasswords")
    }
  }
}
