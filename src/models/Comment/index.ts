import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";


export interface IComment {
  _id: string;
  body: string;
  htmlBody: string;
  author: string;
  email: string;
  postId: string;
  timestamp: string;
}

export const CommentSchema: Schema = new Schema<ICommentDocument>({
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
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: String,
    default: moment(Date.now()).format("LL")
  }
});

export interface ICommentDocument extends Document {
  id: Types.ObjectId;
  body: string;
  htmlBody: string;
  author: string;
  email: string;
  postId: Types.ObjectId;
  timestamp: string;

  // 使用gravatar的头像服务
  // size, default, rating
  gravatar: (s: string, d: string, r: string) => string;
}

export interface ICommentModel extends Model<ICommentDocument> {
  new: (postId: string, author: string, email: string, body: string) => Promise<ICommentDocument>;

  fromJson: (data: IComment) => Promise<void>;
}

const Comment: ICommentModel = model<ICommentDocument, ICommentModel>("Comment", CommentSchema);
export default Comment;
