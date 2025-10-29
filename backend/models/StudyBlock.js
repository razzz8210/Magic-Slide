import mongoose from "mongoose"

const studyBlockSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  subject: String,
  color: {
    type: String,
    default: "#3b82f6",
  },
  notifyEmail: {
    type: Boolean,
    default: true,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Validate no overlapping study blocks
studyBlockSchema.pre("save", async function (next) {
  const overlapping = await mongoose.model("StudyBlock").findOne({
    userId: this.userId,
    _id: { $ne: this._id },
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime },
  })

  if (overlapping) {
    throw new Error("Study block overlaps with existing block")
  }
  next()
})

export default mongoose.model("StudyBlock", studyBlockSchema)
