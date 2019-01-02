var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 单个博客信息表
 */

var BlogSchema = new Schema({
    title: String, // 文章标题
    authorID: String, // 作者ID
    content: String, // 文章内容
    date: Date, // 发表日期
    tag: String, // 文章标签
    attetion_num: Number, // 关注数量
    review_num: Number, // 评论数量
    look_num: Number, // 浏览次数 
});

module.exports = BlogSchema;