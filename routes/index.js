// var express = require('express');
// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports=function (app) {
    app.get('/',function (req,res) {
        res.redirect('/posts')
    });
    app.use('/posts',require('./posts'));
    app.use('/signup',require('./signup'));
    app.use('/signin',require('./signin'));
    app.use('/signout',require('./signout'));
    app.use('/comments',require('./comments'));

}


//module.exports = router;
