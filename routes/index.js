var reg = require('./register')
var login = require('./login')
var blog = require('./blog')
var message = require('./message')
var user = require('./userMessage');

/**
 * 所有路由的接口，分发作用,app是express的实例
 */
module.exports = function(app){
    app.get('/register', function(req, res){ // 处理请求，跳转到注册页面
        var user = req.session.user || null;
        res.render('register', {
            title: '樊宝博客-注册'
        })
    })

    app.post('/doRegister', reg.createUser); // 验证注册信息

    app.get('/login', function(req, res){ // 处理请求，跳转到登陆页面
        var user = req.session.user || null;
        res.render('login', {
            title: '樊宝博客-登陆',
            error: ''
        })
    })

    app.post('/doLogin', login.login); // 验证信息

    app.get('/bloglist', blog.getAllBlog); // 跳到文章列表

    app.get('/messList', message.getAllMessage); // 获取所有的消息列表

    app.get('/writeBlog', function(req, res){
        var user = req.session.user || null;
        message.totalUnreadMess(user._id).then(function(total){
            res.render('writeBlog', {
                title: '樊宝博客-写博客',
                user: user,
                totalMess: total,
            })
        })
    }); // 跳转到写博客的页面

    app.post('/submitBlog', blog.createBlog); // 提交博客

    app.get('/myblog/:id', user.getBlogByUser); // 通过用户ID查找其所有的博客、未读消息

    app.get('/blog/:id', blog.getBlog);  // 获得某条博客信息

    app.get('/updateLike', blog.updateLike); // 更新博客的喜欢数

	app.post('/submitReview', review.submitReview);  // 提交博客的评论

    app.post('/submitReply', review.submitReply); // 提交用户之间的回复
    
    app.get('/usercenter', user.getUsermess)

    app.get('/account', function (req, res){
		var user = req.session.user || null;
		message.totalUnreadMess(user._id).then(function (total){
			res.render('account', {
				title: '小静博客——账户信息',
				user: user,
				totalmess: total,
			});
		});
    });
    
    app.post('/updateUsermess', user.updateUsermess)
}