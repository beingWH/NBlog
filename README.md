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

  
  
  
  
  
  
