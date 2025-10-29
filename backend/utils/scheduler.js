import cron from "node-cron"
import nodemailer from "nodemailer"
import StudyBlock from "../models/StudyBlock.js"

// Run every minute to check for upcoming study blocks
export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date()
      const fiveMinutesLater = new Date(now.getTime() + 5 * 60000)

      // Find study blocks starting in the next 5 minutes
      const upcomingBlocks = await StudyBlock.find({
        startTime: {
          $gte: now,
          $lte: fiveMinutesLater,
        },
        notifyEmail: true,
        notificationSent: { $ne: true }, // Only send once
      }).populate("userId")

      for (const block of upcomingBlocks) {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
          console.log("Email credentials not configured. Skipping reminder email.")
          continue
        }

        // Send reminder email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: block.userId.email,
          subject: `Reminder: Your study block "${block.title}" starts in 5 minutes!`,
          html: `
            <h2>Study Block Reminder</h2>
            <p>Your study block <strong>${block.title}</strong> is starting in 5 minutes!</p>
            <p><strong>Subject:</strong> ${block.subject || "N/A"}</p>
            <p><strong>Start Time:</strong> ${new Date(block.startTime).toLocaleString()}</p>
            <p>Get ready and minimize distractions!</p>
          `,
        }

        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          })

          await transporter.sendMail(mailOptions)
          
          // Mark as sent to avoid sending duplicate reminders
          await StudyBlock.findByIdAndUpdate(block._id, { notificationSent: true })
          
          console.log(`✅ Reminder email sent for block: ${block.title}`)
        } catch (error) {
          console.error("❌ Failed to send reminder email:", error.message)
        }
      }
    } catch (error) {
      console.error("Scheduler error:", error)
    }
  })

  console.log("📧 Email notification scheduler started (checks every minute)")
}
