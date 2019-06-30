import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";

import { ICommentDocument } from "../Comment";


export interface IPostAndComments {
  post: IPostDocument;
  comments: ICommentDocument[];
}

export const PostSchema: Schema<IPostDocument> = new Schema<IPostDocument>({
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
  htmlPreview: {
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

export interface IPostDocument extends Document {
  id: Types.ObjectId;
  title: string;
  body: string;
  htmlBody: string;
  wall: string;
  timestamp: string;
  views: number;

  comments: () => Promise<ICommentDocument[]>;

  deleteWithComments: () => Promise<void>;

  updateAllFields: (title: string, timestamp: string, body: string, wall: string) => Promise<IPostDocument>;
}

export interface IPostModel extends Model<IPostDocument> {
  new: (title: string, body: string, wall: string) => Promise<IPostDocument>;

  queryById: (id: string) => Promise<IPostDocument>;

  queryAll: () => Promise<IPostDocument[]>;

  queryWithComments: (postId: string) => Promise<IPostAndComments>;

  queryManyWithComments: (postIds: string[]) => Promise<IPostAndComments[]>;
}

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", PostSchema);

export default Post;
