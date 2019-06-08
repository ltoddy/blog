interface IRegexs {
  [key: string]: RegExp;
}

const regexs: IRegexs = {
  email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  username: /^[A-Za-z]+/,
};

// const validator = new Validator();
// const [ok, message] = validator.email(email).result();
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

  public result(): [boolean, string] {
    switch (this.mode) {
      case "email":
        if (!this.data) return [false, "邮箱不能为空"];
        if (!regexs[this.mode].test(this.data)) return [false, "邮箱格式不正确"];
        return [true, ""];
      case "username":
        if (!this.data) return [false, "用户名不能为空"];
        if (!regexs[this.mode].test(this.data)) return [false, "用户名格式不正确"];
        return [true, ""];
      case "password":
        const [password, password2] = this.data.split("\n");
        if (!password || !password2) return [false, "密码不能为空"];
        if (password !== password2) return [false, "两次密码不一致"];
        return [true, ""];
      default:
        return [true, ""];
    }
  }
}
