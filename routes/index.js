var reg = require('./register')
var login = require('./login')

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
}