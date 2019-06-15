# blog

[![Build status](https://ci.appveyor.com/api/projects/status/7s0giiex0yx6p03t?svg=true)](https://ci.appveyor.com/project/ltoddy/blog)
[![CircleCI](https://circleci.com/gh/ltoddy/blog.svg?style=svg)](https://circleci.com/gh/ltoddy/blog)

关于环境变量，具体看`src/config.ts`文件。

**前提：**

- mongo 数据库

**开发环境使用：**

使用tmux打开两个终端，第一个终端运行`yarn watch-ts`， 第二个终端运行`yarn watch-node`。

## TODO

- [ ] 全局样式优化
- [ ] 更新flash设计
- [ ] 首页设计
- [ ] 后端部分异常处理
- [ ] 删除某一篇文章时，对应的留言也删掉
- [ ] controller层部分逻辑移动到model层
- [ ] 分页
- [ ] 增加外部配置，提高二次重用性
- [ ] 完成后端功能，如阅读量，格式化时间戳
- [ ] 重构校验表单机制
- [ ] Github Oauth
- [ ] 增加一些restful接口，方便blog迁移与重建
- [ ] 对部分接口添加Graphql的支持
- [ ] 更加未来，view层使用React，（客户端渲染或服务端渲染）
