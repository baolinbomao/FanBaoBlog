/**
 * 登陆
 */
var User = require('../models/user');

exports.login = function(req, res) {
    checkLogin(req, res)
}

// 检查登陆
function checkLogin(req, res) {
    var name = req.body.name;
    var password = req.body.password;

    User.findOne({ name: name }, function (err, user) {
        if (user === null) {
            res.render('login', {
                title: '登录',
                error: '用户不存在！'
            });
        } else {
            if (user.password != password) {
                res.render('login', {
                    title: '登录',
                    error: '密码错误！'
                });
            } else {
                req.session.user = user;
                res.redirect('/bloglist');
            }
        }
    })
}