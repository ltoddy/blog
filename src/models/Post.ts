import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";

export interface IPost extends Document {
  id: Types.ObjectId;
  title: string;
  body: string;
  htmlBody: string;
  wall: string;
  timestamp: string;
  views: number;
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
  wall: { // image absolute url
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: moment(Date.now()).format("LL")
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Post: Model<IPost> = model<IPost>("Post", PostSchema);

export default Post;
