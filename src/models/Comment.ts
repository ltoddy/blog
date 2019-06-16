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

CommentSchema.statics.new = function (postId: string, author: string, email: string, body: string): Promise<ICommentDocument> {
  const htmlBody = md.render(body);
  const url = "https://www.gravatar.com/avatar/";
  const gravatarHash = crypto.createHash("md5").update(email).digest("hex");
  // 使用gravatar的头像服务
  const gravatar = `${join(url, gravatarHash)}?${querystring.stringify({ d: "identicon", s: "40", r: "g" })}`;
  const timestamp = moment(Date.now()).format("LL");

  return Comment.create({ postId, author, email, body, htmlBody, gravatar, timestamp });
};

export interface ICommentDocument extends Document {
  id: Types.ObjectId;
  body: string;
  htmlBody: string;
  author: string;
  email: string;
  gravatar: string;
  postId: Types.ObjectId;
  timestamp: string;
}

export interface ICommentModel extends Model<ICommentDocument> {
  new: (postId: string, author: string, email: string, body: string) => Promise<ICommentDocument>;
}

const Comment: ICommentModel = model<ICommentDocument, ICommentModel>("Comment", CommentSchema);
export default Comment;
