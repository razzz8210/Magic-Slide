import express from "express"
import StudyBlock from "../models/StudyBlock.js"
import { sendStudyBlockEmail } from "../utils/email.js"

const router = express.Router()

// Create study block
router.post("/", async (req, res) => {
  try {
    const { userId, title, description, startTime, endTime, subject, color, notifyEmail } = req.body

    const studyBlock = new StudyBlock({
      userId,
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      subject,
      color,
      notifyEmail,
    })

    await studyBlock.save()

    if (notifyEmail) {
      await sendStudyBlockEmail(userId, studyBlock, "created")
    }

    res.status(201).json(studyBlock)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all study blocks for user
router.get("/user/:userId", async (req, res) => {
  try {
    const blocks = await StudyBlock.find({ userId: req.params.userId }).sort({ startTime: 1 })
    res.json(blocks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get study block by ID
router.get("/:id", async (req, res) => {
  try {
    const block = await StudyBlock.findById(req.params.id)
    if (!block) {
      return res.status(404).json({ error: "Study block not found" })
    }
    res.json(block)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update study block
router.put("/:id", async (req, res) => {
  try {
    const { title, description, startTime, endTime, subject, color, notifyEmail } = req.body

    const block = await StudyBlock.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subject,
        color,
        notifyEmail,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!block) {
      return res.status(404).json({ error: "Study block not found" })
    }

    res.json(block)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete study block
router.delete("/:id", async (req, res) => {
  try {
    const block = await StudyBlock.findByIdAndDelete(req.params.id)
    if (!block) {
      return res.status(404).json({ error: "Study block not found" })
    }
    res.json({ message: "Study block deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
