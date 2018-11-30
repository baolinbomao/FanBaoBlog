var User = require('../models/user');

exports.createUser = function (req, res) {
    if(checkRegisterInfo(req, res)){
        registeruser(req, res)
    }else{
        res.render('/register', {
            titile: '注册',
            error: '用户名或者邮箱已被注册，请重试！',
        });
    }
};

// 检查是否已经注册过
function checkRegisterInfo(req, res){
    var name = req.body.name;
    var email = req.body.name;

    User.findOne({name: name}, function(err, user){
        if(user === null){
            User.findOne({email: email}, function(err, email){
                if(email){
                    return false;
                }
            });
        }else{
            return false;
        }
    })

    return true;
}

// 注册用户
function registeruser(req, res){
    var userMessage = {
        name: req.body.name,
        password: req.body.password,
        icon: '12.png',
        sex: '',
        phone: '123456789',
        qq: '123456789',
        wechat: '123456789',
        weibo: '123456789',
        email: req.body.email,
    }

    var user = new User(userMessage);
    User.save(function (err, data){
        if(err){
            res.send(err);
        }else{
            console.log(data);
            res.redirect('/login');
        }
    });
}