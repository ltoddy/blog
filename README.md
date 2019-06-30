<h1 align="center">Welcome to my blog 👋</h1>
<p>
  <a href="https://ci.appveyor.com/project/ltoddy/blog">
    <img alt="Build status" src="https://ci.appveyor.com/api/projects/status/7s0giiex0yx6p03t?svg=true" target="_blank" />
  </a>
  <a href="https://circleci.com/gh/ltoddy/blog">
    <img alt="CircleCI" src="https://circleci.com/gh/ltoddy/blog.svg?style=svg" target="_blank" />
  </a>
  <a href="https://twitter.com/ltoddygen">
    <img alt="Twitter: ltoddygen" src="https://img.shields.io/twitter/follow/ltoddygen.svg?style=social" target="_blank" />
  </a>
</p>

> 记录生活与技术 (小清新风格的blog)

![demo](https://img.vim-cn.com/1f/04917d4f94052d54bd5c3cae867bd56bfa1aec.jpg)

## 使用说明:

部署:

- 下载代码

> git clone https://github.com/ltoddy/blog.git

- 使用docker运行:

> docker-compose up -d

- caddy 配置

**假设你的域名是`blog.example.com`**

```
blog.example.com:80 {
  proxy / localhost:3000
  gzip
  tls off
  basicauth /auth/signup "owner" "helloworld"
  log logs/access.log
}
```

此时访问 `blog.example.com/auth/signup` 需要输入账号（`owner`）密码（`helloworld`），避免其他人注册。

## 开发环境

关于环境变量，具体看`src/config.ts`文件。

**前提：**

- mongo 数据库

**开发环境使用：**

使用tmux打开两个终端，第一个终端运行`yarn watch-ts`， 第二个终端运行`yarn watch-node`。

打开浏览器访问 `localhost:3000`

## TODO

- [x] 全局样式优化
- [ ] 更新flash设计
- [x] 首页设计
- [x] 后端部分异常处理
- [ ] 移动端样式适配
- [x] 删除某一篇文章时，对应的留言也删掉
- [x] controller层部分逻辑移动到model层
- [ ] 分页
- [x] 增加语义化标签
- [x] 404页面样式
- [ ] 增加外部配置，提高二次重用性
- [x] 完成后端功能，如阅读量，格式化时间戳
- [ ] 重构校验表单机制
- [ ] 前端校验
- [ ] 完善单元测试
- [x] blog迁移与重建
- [ ] 对部分接口添加Graphql的支持
- [ ] 更加未来，view层使用React，从mvc转向mvvm，（客户端渲染或服务端渲染）

## 📝 License

Copyright © 2019 [ltoddy &lt;taoliu0509@gmail.com&gt;](https://github.com/ltoddy).<br />
This project is [MIT](https://github.com/ltoddy/blog/blob/master/LICENSE) licensed.
