import { Document, model, Model, Schema, Types } from "mongoose";
import moment from "moment";
import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import Comment, { ICommentDocument } from "./Comment";
import { POSTS_PER_PAGE } from "../config";

const md = new MarkdownIt();


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

PostSchema.statics.fromJson = function (data: IPostDocument): Promise<void> {
  console.log("post data: ", data);
  return new Promise<void>((resolve, reject) => {
    Post.create(data, (error: MongoError) => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

PostSchema.statics.paginate = function (page: number, perPage: number = POSTS_PER_PAGE): Promise<IPostDocument[]> {
  // @param page: >= 0
  // @param perPage: > 0

  if (page < 0) {
    page = 0;
  }

  if (perPage <= 0) {
    perPage = POSTS_PER_PAGE;
  }

  const limit = perPage;
  const skip = page * perPage;

  return new Promise<IPostDocument[]>((resolve, reject) => {
    Post.find({}, null, { limit, skip }, (error: MongoError, posts: IPostDocument[]): void => {
      if (error) {
        return reject(error);
      }

      return resolve(posts);
    });
  });
};


// --------------------------------------

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

export interface IPostAndComments {
  post: IPostDocument;
  comments: ICommentDocument[];
}


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

  fromJson: (data: IPostDocument) => Promise<void>;

  paginate: (page: number, perPage: number) => Promise<IPostDocument[]>;
}

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", PostSchema);

export default Post;
