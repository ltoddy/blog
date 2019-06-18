import { ValidateError } from "../errors";

interface IRegexs {
  [key: string]: RegExp;
}

const regexs: IRegexs = {
  email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  username: /^[A-Za-z]+/,
  url: /https?:\/\/.+/
};


export default class Validator {
  private data: string;
  private mode: string;

  constructor() {
    this.data = "";
    this.mode = "";
  }

  private clean(): void {
    this.data = "";
    this.mode = "";
  }

  // for auth router
  public email(email: string): Validator {
    this.data = email;
    this.mode = "email";
    return this;
  }

  public username(username: string): Validator {
    this.data = username;
    this.mode = "username";
    return this;
  }

  public password(password: string, password2: string): Validator {
    this.data = [password, "\n", password2].join("");
    this.mode = "password";
    return this;
  }

  // for posts router
  public title(title: string): Validator {
    this.data = title;
    this.mode = "title";
    return this;
  }

  public body(body: string): Validator {
    this.data = body;
    this.mode = "body";
    return this;
  }

  public absoluteUrl(url: string): Validator {
    this.data = url;
    this.mode = "url";
    return this;
  }

  public done() {
    switch (this.mode) {
      case "email":
        if (!this.data) throw(new ValidateError("邮箱不能为空"));
        if (!regexs[this.mode].test(this.data)) throw(new ValidateError("邮箱格式不正确"));
        return;
      case "username":
        if (!this.data) throw(new ValidateError("用户名不能为空"));
        if (!regexs[this.mode].test(this.data)) throw(new ValidateError("用户名格式不正确"));
        return;
      case "password":
        const [password, password2] = this.data.split("\n");
        if (!password || !password2) throw(new ValidateError("密码不能为空"));
        if (password !== password2) throw(new ValidateError("两次密码不一致"));
        return;
      case "title":
        if (!this.data) throw(new ValidateError("标题不能为空"));
        return;
      case "body":
        if (!this.data) throw(new ValidateError("内容不能为空"));
        return;
      case "url":
        if (!regexs[this.mode].test(this.data)) throw(new ValidateError("url格式不正确"));
        return;
      default:
        return;
    }
  }
}
