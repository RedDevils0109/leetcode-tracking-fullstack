const mongoose = require("mongoose");
const slugify = require("slugify");

// Leetcode Schema
const leetcodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter title name"],
    },
    slug: {
      type: String,
    },
    difficulty: {
      type: String,
      required: [true, "Please enter difficulty level"],
      enum: ["easy", "medium", "hard"],
    },
    linkURL: {
      type: String,
    },
    topics: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Topic", // Refers to the Topic model
      },
    ],
    note: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Refers to the User model
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to create a slug from the name before saving in Leetcode
leetcodeSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create Leetcode model
const Leetcode = mongoose.model("Leetcode", leetcodeSchema);
module.exports = Leetcode