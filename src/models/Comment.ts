import { Document, model, Model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  id: Types.ObjectId;
  body: string;
  htmlBody: string;
  postId: Types.ObjectId;
  timestamp: Date;
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
    type: Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: Schema.Types.Date,
    default: Date.now()
  }
});

const Comment: Model<IComment> = model<IComment>("Comment", CommentSchema);

export default Comment;
