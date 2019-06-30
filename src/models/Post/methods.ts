import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import Post, { IPostDocument, PostSchema } from ".";
import Comment, { ICommentDocument } from "../Comment";

const md = new MarkdownIt();


// 实例方法
PostSchema.methods.comments = function (): Promise<ICommentDocument[]> {
  return new Promise<ICommentDocument[]>((resolve, reject) => {
    Comment.find({ postId: this._id }, (error: MongoError, comments: ICommentDocument[]) => {
      if (error) {
        return reject(error);
      }

      return resolve(comments);
    });
  });
};

PostSchema.methods.deleteWithComments = function (): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Post.deleteOne({ _id: this._id }, (error: MongoError) => {
      if (error) {
        return reject(error);
      }

      // 即使没有被连同删除，影响不大
      Comment.deleteMany({ postId: this._id }, (error1: MongoError) => {
        if (error1) {
          // TODO: ?
        }
      });

      return resolve();
    });
  });
};

PostSchema.methods.updateAllFields = function (title: string, timestamp: string, body: string, wall: string): Promise<IPostDocument> {
  return new Promise<IPostDocument>((resolve, reject) => {
    const htmlBody = md.render(body);
    const preview = body.substring(0, 200);
    const htmlPreview = md.render(preview);

    Post.findByIdAndUpdate(this._id, {
      title,
      timestamp,
      body,
      htmlBody,
      htmlPreview,
      wall
    }, (error: MongoError, post: IPostDocument) => {
      if (error) {
        return reject(error);
      }

      return resolve(post);
    });
  });
};
