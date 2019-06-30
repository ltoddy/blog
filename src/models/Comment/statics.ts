import moment from "moment";
import MarkdownIt from "markdown-it";

import Comment, { CommentSchema, IComment, ICommentDocument } from ".";
import { MongoError } from "mongodb";

const md = new MarkdownIt();


// 静态方法
CommentSchema.statics.new = function (postId: string, author: string, email: string, body: string): Promise<ICommentDocument> {
  const htmlBody = md.render(body);
  const timestamp = moment(Date.now()).format("LL");

  // TODO: 抛错
  return Comment.create({ postId, author, email, body, htmlBody, timestamp });
};

CommentSchema.statics.fromJson = function (data: IComment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Comment.create(data, (error: MongoError) => {
      if (error) {
        return reject(error);
      } else {
        // TODO: void type
        return resolve();
      }
    });
  });
};
