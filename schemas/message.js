var Schema = require('mongoose').Schema;

/**
 * 单个用户的所有博客的评论信息表
 */

var MessgaeSchema = new Schema({
    authorID: String, // 文章作者ID
    messageList: [{
        commentID: String, // 评论用户ID
        commentName: String, // 评论用户名称
        commentIcon: String, // 评论用户icon
        blogID: String, // 博客ID
        blogName: String, // 博客名称
        hostID: String, // 写该博客的用户id
        commentContent: String, // 评论内容
        actionType: Number, // 0表示不喜欢, 1表示喜欢, 2表示评论, 3表示回复
        status: Number, // 0表示未查看, 1表示已查看
        commentDate: Date, // 评论日期
    }]
});

module.exports = MessgaeSchema;