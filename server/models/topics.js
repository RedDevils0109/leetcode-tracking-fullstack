const mongoose = require("mongoose");
const slugify = require("slugify");

// Topic Schema
const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter topic name"],
  },
  slug: {
    type: String,
    unique: true,
  },
});

// Middleware to create a slug from the name before saving
topicSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create Topic model
const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
