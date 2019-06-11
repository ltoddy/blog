import { Document, model, Model, Schema, Types } from "mongoose";

export interface IPost extends Document {
  id: Types.ObjectId;
  title: string;
  body: string;
  htmlBody: string;
  data?: Date;
  views?: number;
}

const PostSchema: Schema<IPost> = new Schema<IPost>({
  title: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  body: {
    type: String, // raw markdown content
    required: true,
  },
  htmlBody: {
    type: String,
    required: true,
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
