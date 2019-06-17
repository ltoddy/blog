import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";
import MarkdownIt from "markdown-it";
import { MongoError } from "mongodb";

import loggerFactory from "../utils/logger";
import Comment, { ICommentDocument } from "./Comment";

const md = new MarkdownIt();
const logger = loggerFactory("Posts.ts");

const PostSchema: Schema<IPostDocument> = new Schema<IPostDocument>({
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


// 静态方法
PostSchema.statics.new = function (title: string, body: string, wall: string): Promise<IPostDocument> {
  const htmlBody = md.render(body);
  return Post.create({ title, body, htmlBody, wall });
};

PostSchema.statics.queryById = function (id: string): Promise<IPostDocument> {
  return new Promise<IPostDocument>((resolve, reject) => {
    // considering Post.findByIdAndUpdate (文档上这个api的用法，在这里不合适，因为是要更改this里面的内容)
    Post.findById(id, (err: MongoError, post: IPostDocument) => {
      if (err) {
        logger.error(`can't find (${id}) post`);
        return reject(err);
      }

      post.views += 1;
      post.save().catch(() => undefined); // 异常不作处理，阅读量增长一的异常目前不重要
      return resolve(post);
    });
  });
};

PostSchema.statics.queryAll = function (): Promise<IPostDocument[]> {
  return new Promise<IPostDocument[]>((resolve, reject) => {
    Post.find((err: MongoError, posts: IPostDocument[]) => {
      if (err) {
        return reject(err);
      }

      return resolve(posts);
    });
  });
};


// 实例方法
PostSchema.methods.comments = function (): Promise<ICommentDocument[]> {
  return new Promise<ICommentDocument[]>((resolve, reject) => {
    Comment.find({ postId: this._id }, (err: MongoError, comments: ICommentDocument[]) => {
      if (err) {
        logger.error(`query post's(${this._id}) comments failed: ${err}`);
        return reject(err);
      }

      return resolve(comments);
    });
  });
};

PostSchema.methods.deleteWithComments = function (): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Post.deleteOne({ _id: this._id }, (err: MongoError) => {
      if (err) {
        logger.error(`delete ${this._id} post failed: ${err}`);
        return reject(err);
      }

      // 即使没有被连同删除，影响不大
      Comment.deleteMany({ postId: this._id }, (err: MongoError) => {
        if (err) {
          logger.error(`delete comments(postId: ${this._id}) failed: ${err}`);
        }
      });

      return resolve();
    });
  });
};

PostSchema.methods.updateAllFields = function (title: string, timestamp: string, body: string, wall: string): Promise<IPostDocument> {
  return new Promise<IPostDocument>((resolve, reject) => {
    const htmlBody = md.render(body);

    Post.findByIdAndUpdate(this._id, {
      title,
      timestamp,
      body,
      htmlBody,
      wall
    }, (err: MongoError, post: IPostDocument) => {
      if (err) {
        logger.error(`update post (${this._id}) failed`);
        return reject(err);
      }

      return resolve(post);
    });
  });
};


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
}

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", PostSchema);

export default Post;
