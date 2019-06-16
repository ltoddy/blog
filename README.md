# blog

[![Build status](https://ci.appveyor.com/api/projects/status/7s0giiex0yx6p03t?svg=true)](https://ci.appveyor.com/project/ltoddy/blog)
[![CircleCI](https://circleci.com/gh/ltoddy/blog.svg?style=svg)](https://circleci.com/gh/ltoddy/blog)

<div align="center">小清新风格的blog</div>

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

打开浏览器访问 `localhost:3000/posts/`

## TODO

- [ ] 全局样式优化
- [ ] 更新flash设计
- [ ] 首页设计
- [x] 后端部分异常处理
- [ ] 移动端样式适配
- [ ] 删除某一篇文章时，对应的留言也删掉
- [x] controller层部分逻辑移动到model层
- [ ] 分页
- [ ] 404页面样式
- [ ] 增加外部配置，提高二次重用性
- [ ] 完成后端功能，如阅读量，格式化时间戳
- [ ] 重构校验表单机制
- [ ] 前端校验
- [ ] 创建新的文章与留言预览功能
- [ ] 增加一些restful接口，方便blog迁移与重建
- [ ] 对部分接口添加Graphql的支持
- [ ] 更加未来，view层使用React，（客户端渲染或服务端渲染）
