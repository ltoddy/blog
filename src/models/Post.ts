import { Document, model, Model, Schema, Types } from "mongoose";

export interface IPost extends Document {
  id: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  body: string;
  htmlBody: string;
  data?: Date;
  views?: number;
}

const PostSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
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
  htmlBody: {
    type: String,
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
});

const Post: Model<IPost> = model<IPost>("Post", PostSchema);

export default Post;
