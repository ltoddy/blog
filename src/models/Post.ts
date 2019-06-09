import mongoose from "mongoose";

export interface IPost {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  body: string;
  data?: Date;
  views?: number;
}

const Post = mongoose.model("Post", new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  body: {
    type: String, // raw markdown content
    required: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
}));

export default Post;
