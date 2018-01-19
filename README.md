# NBlog

## 项目结构
- NBLog
  - bin
    - www 
  - config
    - default.js
  - lib
    -mongo.js
  - logs
    - success.log
  - middlewares
    - check.js
  - node_modules
  - public
    - css
    - img
    - stylesheets
  - routes
  - views
    -components
  - app.js
  - package.json
  
  ### 项目结构说明
  
  项目|说明
  :--:|:--:
  app.js|程序入口，放置一些程序公共变量，中间件
  package.json|模块引用及版本信息
  bin/www|架构服务端
  lib/mongo.js|连接数据库，组织实体
  models|DTO
  routes|Controller
  views|View
  config|配置，存放port，session，dblink
  middlewares|中间件
  public|公共资源库
  node_modules|模块库
  
## 笔记

### 模块系统
一个.js文件需要被其他.js文件引用时，可以采用模块化方案.
1. 方案一
```JS
// 1.js
module.exports={
  create:function create(post){
    return Post.create(post).exec()
  }
}
//2.js
var PostModel=require(1)
PostModel.create(post)  
```
2. 方案二
```JS
// 1.js
PostModel={
  create:function create(post){
    return Post.create(post).exec()
  }
}
module.exports=PostModel
//2.js
var PostModel=require(1)
PostModel.create(post)  
```
  
3. 方案三
```JS
//1.js
exports.User=mongolass.model('User',{
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' }
})
//2.js
var User=require(1).User
User.create(user).exec()
```
### 面向对象
```JS
//1.JS
class BaseResult{
  constructor(code,data){
    this.code=code;
    this.data=data;
  }
  setCode(code){
    this.code=code;
  }
  getCode(){
    return this.code;
  }
  setData(data){
    this.data=data;
  }
  getData(){
    return this.data;
  }
}
module.exports={
  SUCCESS:new BaseResult(0,{}),
  FAILED:new BaseResult(1,{})
}
//也可以
module.exports=BaseResult;
```
调用时:
```JS
var BaseResult=require(1);
BaseResult.SUCCESS.setData(100);
//也可以
var BaseResult=require(1);
baseresult=new BaseResult(0,{});
baseresult.setData(100);
```
### 中间件
> 中间件是req与res之间需要去处理的细节，如session，cookie，router，logger等。<br>
> 中间件在程序编译时被压入stack数组保存，等待匹配后触发进行<br>
> 中间件使用`app.use()`形式保存<br>
> 中间件使用`next()`形式进行接力执行<br>
-----
中间件需要注意压入stack数组的顺序，因为这关系到调用中间件时的顺序，据我试验，中间件一般性次序为：

```JS
app.use(session) //session启用
app.use(mongodb) //数据库连接
app.use(flash)  //flash通知
app.use(formidable) //表单提交
app.locals//本地常量
app.use(res.locals) //本地变量
app.use(logger) //正常日志
routes(app) //route
app.use(logger) //错误日志
```

### 关于app.locals与res.locals
在调用`res.render`的时候，express会merge三处结果传入要渲染的模板。
> 优先级为: res.render传入对象>res.locals对象>app.locals对象
------
从某种意义来说，app.locals与res.locals之间并没有区别，但我们通常在app.locals下挂载常量信息，在res.locals下挂载变量信息，在挂载后，渲染模板时，就不需要从`res.render`的时候传入。
```JS
// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})
```
### 关于config-lite
> config-lite 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同加载 config 目录下不同的配置文件。如果不设置NODE_ENV，则读取默认的 default 配置文件，如果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持.js、.json、.node、.yml、.yaml 后缀的文件。
----
使用以下方式操作config-lite
```JS
module.exports={
    port:3000,
    session:{
        secret:'myblog',
        key:'myblog',
        maxAge:2592000000
    },
    mongodb:'mongodb://192.9.190.199:27017/myblog'
}
```
```JS
var config=require('config-lite')(__dirname)
config.session.secret
```
### 关于flash
当我们操作成功时，需要显示一个成功的通知，如登录成功跳转到主页时，需要显示一个`登录成功`的通知，我们可以基于`connect-flash`中间件实现这个功能。

`connect-flash`是基于session实现的：设置初始值`req.session.flash={}`，通过`req.flash(name,value)`设置这个对象下的字段和值，通过`req.flash(name)`获取这个对象下的值，同时删除这个字段，实现只显示一次刷新后消失的功能。

### 关于mongolass
mongolass是用于连接mogodb数据库的工具，这里主要记录mongolass.plugin功能，plugin用于扩展mongolass功能。
> 当使用mongolass.plugin扩展时，可以在所有model上使用扩展功能。
> 当使用model.plugin扩展时，仅可在此model上使用扩展功能.

plugin主要用于为数据库查询出的object添加attribute。
比如，根据id生成timestamp
```JS
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
       return results.map(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
            return item
        })
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})
```
比如，根据外键关系计算出包含的其他模型记录数量
```JS
Post.plugin('addCommentsCount',{
    afterFind:function (posts) {
        return Promise.all(posts.map(
            function (post) {
                return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
                    post.commentsCount=commentsCount
                    return post
                })
            }
))
    },
    afterFindOne: function (post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function (count) {
                post.commentsCount = count
                return post
            })
        }
        return post
    }
})
```
### ES5

> [深入Promise](https://zhuanlan.zhihu.com/p/25178630)

1. Promise
Promise本身是一个构造函数，它可以调用四种方法来进行Promise<T>对象的构造。
  
  - Promise.all(iterable)  返回一个Promise<T>对象，异步回调为一个values数组
  - Promise.reject 返回一个Promise<T>对象，异步回调值为捕获错误的Promise<T>对象
  - Promise.race(iterable) 返回一个Promise<T>对象，异步回调值为第一个值
  - Promise.resolve（any） 返回一个Promise<T>,异步回调为第一个值为any
  
通过以上四种方法，将传入对象包裹成一个Promise<T>对象，Promise<T>实现以下接口方法
  
  - .then 异步回调，return出的还是一个Promise<T>对象
  - .catch 错误捕获

基本实现 Promise.all().then().catch()
```JS
Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)// pv 加 1
    ])
        .then(function (result) {
            const post = result[0]
            const comments=result[1]
            if (!post) {
                throw new Error('该文章不存在')
            }

            res.render('post', {
                post: post,
                comments:comments
            })
        })
        .catch(next)   //抛到错误处理中间件
})
```
使用以下方法对Promise进行试验。







  
  
  
