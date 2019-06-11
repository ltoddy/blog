import { Document, model, Model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  id: Types.ObjectId;
  body: string;
  htmlBody: string;
  postId: Types.ObjectId;
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
});

const Comment: Model<IComment> = model<IComment>("Comment", CommentSchema);

export default Comment;
