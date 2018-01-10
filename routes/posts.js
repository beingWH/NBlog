var express=require('express')
var router=express.Router()
var PostModel=require('../models/posts')

var checkLogin=require('../middlewares/check').checkLogin

router.get('/',function (req,res,next) {
    res.render('posts')
})
router.post('/create', checkLogin, function (req, res, next) {
    var author=req.session.user._id
    var title=req.fields.title
    var content=req.fields.content

    //校验参数
    try{
        if(!title.length){
            throw new Error('请填写标题')
        }
        if(!content.length){
            throw new Error('请填写内容')
        }
    }catch (e){
        req.flash('error',e.message)
        return res.redirect('back')
    }
    let post={
        author:author,
        title:title,
        content:content
    }
    PostModel.create(post).then(
        function (result) {
            post=result.ops[0]
            req.flash('success','发表成功')
            res.redirect('/posts/${post._id}')
        }
    )
        .catch(next)

})
router.get('/create', checkLogin, function (req, res, next) {
   res.render('create')
})
router.get('/:postId', function (req, res, next) {
    res.send('文章详情页')
})
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    res.send('更新文章页')
})
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    res.send('更新文章')
})
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    res.send('删除文章')
})
module.exports=router