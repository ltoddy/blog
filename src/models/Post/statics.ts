import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import { ICommentDocument } from "../Comment";
import Post, { IPostAndComments, IPostDocument, PostSchema } from "./index";


const md = new MarkdownIt();

// 静态方法
PostSchema.statics.new = function (title: string, body: string, wall: string): Promise<IPostDocument> {
  const htmlBody = md.render(body);
  const preview = body.substring(0, 200);
  const htmlPreview = md.render(preview);
  return Post.create({ title, body, htmlBody, htmlPreview, wall });
};

PostSchema.statics.queryById = function (id: string): Promise<IPostDocument> {
  return new Promise<IPostDocument>((resolve, reject) => {
    // considering Post.findByIdAndUpdate (文档上这个api的用法，在这里不合适，因为是要更改this里面的内容)
    Post.findById(id, (error: MongoError, post: IPostDocument) => {
      if (error) {
        return reject(error);
      }

      post.views += 1;
      post.save().catch(() => null); // 异常不作处理，阅读量增长一的异常目前不重要
      return resolve(post);
    });
  });
};

PostSchema.statics.queryAll = function (): Promise<IPostDocument[]> {
  // sort
  return new Promise<IPostDocument[]>((resolve, reject) => {
    Post.find({}, null, { sort: { _id: -1 } }, (error: MongoError, posts: IPostDocument[]) => {
      if (error) {
        return reject(error);
      }

      return resolve(posts);
    });
  });
};

PostSchema.statics.queryWithComments = async function (postId: string): Promise<IPostAndComments> {
  try {
    // TODO: 优化?
    const post: IPostDocument = await Post.queryById(postId);
    const comments: ICommentDocument[] = await post.comments();
    return Promise.resolve<IPostAndComments>({ post, comments });
  } catch (error) {
    return Promise.reject(error);
  }
};

PostSchema.statics.queryManyWithComments = function (postIds: string[]): Promise<IPostAndComments[]> {
  return Promise.all(postIds.map((postId: string) => Post.queryWithComments(postId)));
};
