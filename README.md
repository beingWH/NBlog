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
>
中间件是req与res之间需要去处理的细节，如session，cookie，router，logger等。<br>
中间件在程序编译时被压入stack数组保存，等待匹配后触发进行<br>
中间件使用`app.use()`形式保存<br>
中间件使用`next()`形式进行接力执行<br>
  
  
  
  
  
  
