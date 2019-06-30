import crypto from "crypto";
import { join } from "path";
import querystring from "querystring";

import { CommentSchema } from ".";


// 实例方法
CommentSchema.methods.gravatar = function (s: string = "40", d: string = "identicon", r: string = "g"): string {
  const url = "https://www.gravatar.com/avatar/";
  const hash = crypto.createHash("md5").update(this.email).digest("hex");
  return `${join(url, hash)}?${querystring.stringify({ d, s, r })}`;
};
