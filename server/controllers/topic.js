const Topic = require("../models/topics");
const slugify = require("slugify");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../utils/errorHandler");

exports.postNewTopic = catchAsync(async (req, res, next) => {
  console.log("Take response", req.body)
  const { topic } = req.body;
  const slug = slugify(topic, { lower: true, strict: true });

  const existedTopic = await Topic.findOne({ slug });

  if (existedTopic) {
    return next(new ErrorHandler("Topic already exists", 403));
  }

  const newTopic = await Topic.create({ name: topic });

  res.status(200).json({
    success: true,
    data: {
      topic: newTopic.name,
      slug: newTopic.slug
    },
  });
});

exports.getAllTopic = catchAsync(async (req,res,next) => {
  const topics = await Topic.find({}).select("-_id")
  res.status(200).json({
    success: true,
    data: {
      topics: topics
    }
  })
})