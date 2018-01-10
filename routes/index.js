

module.exports=function (app) {
    app.get('/',function (req,res) {
        res.redirect('/posts')
    });
    app.use('/posts',require('./posts'));
    app.use('/signup',require('./signup'));
    app.use('/signin',require('./signin'));
    app.use('/signout',require('./signout'));
    app.use('/comments',require('./comments'));
    app.use(function (req,res) {
        if (!res.headersSent) {
            return res.status(404).render('404')
        }
    })
    app.use(function (err, req, res, next) {
        console.error(err)
        req.flash('error', err.message)
        res.redirect('/posts')
    })

}


//module.exports = router;
