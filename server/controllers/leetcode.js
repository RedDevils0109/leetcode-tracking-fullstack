const Leetcode = require("../models/leetcodes");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../utils/errorHandler");
const Topic = require("../models/topics");
const slugify = require("slugify");

const topicsId = async (topicsArray) => {
  const res = await Topic.find({ slug: { $in: topicsArray } }).select("_id");
  return res;
};



exports.postLeetcode = catchAsync(async (req, res, next) => {
  console.log("Take response: ", req.body);
  const { name, difficulty, linkUrl, topics, note } = req.body;

  // Check if the Leetcode problem already exists based on slug
  const slug = slugify(name, { lower: true, strict: true });
  const existedName = await Leetcode.findOne({ slug });
  if (existedName) {
    return next(new ErrorHandler("Name already exists", 403));
  }

  // Ensure topics are split into an array, handle cases where topics might be undefined
  const topicsArray = topics
    ? topics.split(",").map((topic) => topic.trim())
    : [];

  // Retrieve _id of topics
  const topicsIdArray = await topicsId(topicsArray);

  // Create new Leetcode problem entry
  const newLeetcode = await Leetcode.create({
    name: name,
    slug: slug, // Store the slug
    difficulty: difficulty,
    linkURL: linkUrl,
    topics: topicsIdArray,
    note: note,
    user_id: req.userId, // Ensure userId is set from the authenticated user
  });

  // Exclude the _id from the response
  const responseLeetcode = newLeetcode.toObject();
  delete responseLeetcode._id;

  res.status(200).json({
    success: true,
    data: {
      leetcode: responseLeetcode,
    },
  });
});

 exports.getAllLeetCode = catchAsync(async (req, res, next) => {
   const leetcodeList = await Leetcode.find({ user_id: req.userId })
     .populate({
       path: "topics",
       select: "slug name -_id", 
     })
     .select("-user_id -_id"); // Exclude 'user_id' from the main Leetcode object

   res.status(200).json({
     success: true,
     data: {
      list: leetcodeList
     }
   });
 });
 
 exports.getSingleLeetcode = catchAsync(async (req, res, next) => {
   const { slug } = req.params; // Corrected this line
   const leetcode = await Leetcode.findOne({ user_id: req.userId, slug: slug })
     .populate({
       path: "topics",
       select: "slug name -_id",
     })
     .select("-user_id -_id");

   if (!leetcode) {
     return next(new ErrorHandler("leetcode problem not found", 403)); 
   }

   res.status(200).json({
     success: true,
     data: {
       leetcode: leetcode,
     },
   });
 });

exports.editSingleLeetcode = catchAsync(async (req, res, next) => {
  const { name, topics } = req.body;
  const { slug } = req.params;

  // Find the existing Leetcode problem by slug and user ID
  const leetcode = await Leetcode.findOne({ slug, user_id: req.userId });
  if (!leetcode) {
    return next(new ErrorHandler("Leetcode problem not found", 404));
  }

  // Handle name and slug update if 'name' is provided in the request body
  if (name) {
    const newSlug = slugify(name, { lower: true, strict: true });
    if (newSlug !== slug) {
      const existedName = await Leetcode.findOne({ slug: newSlug });
      if (existedName) {
        return next(new ErrorHandler("Name already exists", 403));
      }
      req.body.slug = newSlug; 
    }
  }


  if (topics) {
    const topicsArray = topics.split(",").map((topic) => topic.trim());
    const topicsIdArray = await topicsId(topicsArray);
    req.body.topics = topicsIdArray; // Set the transformed topics array in the body
  }

  // Update only the fields that exist in req.body
  const updatedLeetcode = await Leetcode.findByIdAndUpdate(
    leetcode._id,
    req.body,
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied on update
    }
  );

  // Exclude the _id from the response
  const responseLeetcode = updatedLeetcode.toObject();
  delete responseLeetcode._id;

  res.status(200).json({
    success: true,
    data: {
      leetcode: responseLeetcode,
    },
  });
});

  

