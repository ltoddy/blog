import crypto from "crypto";
import { join } from "path";
import querystring from "querystring";

import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();


const CommentSchema: Schema = new Schema<ICommentDocument>({
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

// 静态方法
CommentSchema.statics.new = function (postId: string, author: string, email: string, body: string): Promise<ICommentDocument> {
  const htmlBody = md.render(body);
  const timestamp = moment(Date.now()).format("LL");

  return Comment.create({ postId, author, email, body, htmlBody, timestamp });
};


// 实例方法
CommentSchema.methods.gravatar = function (s: string = "40", d: string = "identicon", r: string = "g"): string {
  const url = "https://www.gravatar.com/avatar/";
  const hash = crypto.createHash("md5").update(this.email).digest("hex");
  return `${join(url, hash)}?${querystring.stringify({ d, s, r })}`;
};


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
}

const Comment: ICommentModel = model<ICommentDocument, ICommentModel>("Comment", CommentSchema);
export default Comment;
