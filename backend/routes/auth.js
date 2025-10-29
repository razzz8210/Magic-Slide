import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Google OAuth callback
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body

    let user = await User.findOne({ googleId })

    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        picture,
      })
      await user.save()
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
