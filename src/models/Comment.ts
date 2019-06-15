import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";

export interface IComment extends Document {
  id: Types.ObjectId;
  body: string;
  htmlBody: string;
  author: string;
  email: string;
  gravatar: string;
  postId: Types.ObjectId;
  timestamp: string;
}

const CommentSchema: Schema = new Schema<IComment>({
  body: {
    type: String, // raw markdown content
    required: true,
  },
  htmlBody: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gravatar: { // gravatar uri
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: String,
    default: moment(Date.now()).format("LL")
  }
});

const Comment: Model<IComment> = model<IComment>("Comment", CommentSchema);

export default Comment;
