import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
  },
  body: String,
  comments: [{
    body: String, date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  meta: {
    views: Number,
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
