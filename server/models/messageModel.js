const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
