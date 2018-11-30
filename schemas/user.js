var Schema = require('mongoose').Schema;

/**
 * 用户信息表
 */

var UserSchema = new Schema({
    name: String, // 用户名
    password: String, // 密码
    icon: String, // 图标
    sex: String, // 性别
    phone: String, // 手机号
    qq: String, // qq
    wechat: String, // 微信
    weibo: String, // 微博
    email: String, // email 
});

module.exports = UserSchema;