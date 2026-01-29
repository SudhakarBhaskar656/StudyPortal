const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    imageId: {
      type: String,
      default: null,
    },
    
     // 🔥 DEMO / DUMMY IMAGE (ONLINE)
    imageUrl: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
