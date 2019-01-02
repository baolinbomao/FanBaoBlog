/**
 * 博客信息
 */
var Message = require('../models/message')

/**
 * 所有未读的消息数量
 */
exports.totalUnreadMess = function (authorID) {
    return new Promise(function (resolve, reject) {
        if (authorID) {
            var count = 0;
            
            Message.findOne({authorID: authorID}, function(err, mess){
                if(mess){
                    var messList = mess.messageList;
                    for(const m of messageList){
                        if(m.status === 0){
                            count += 1;
                        }
                    }
                }
                resolve(count)
            })
        }
    })
}

/**
 * 获取所有的消息列表
 */
exports.getAllMessage = function(req, res) {
    var user = req.session.user || null;
    if(user){
        var authorID = user._id;
    }
    Message.findOne({authorID: authorID}, function(err, mess){
        if(mess){
            var messList = mess.messageList;
            for(const m of messList){
                m.status = 1;
            }
            Message.update({authorID: authorID}, {messageList: messList}, function (err, doc){
				if (doc.ok){
					res.render('message', {
						title: '樊宝博客——消息',
						user: user,
						totalmess: 0,
						messlist: messlist,
						error: ''
					});
				}
			})
        }else{
            res.render('message', {
				title: '樊宝博客——消息',
				user: user,
				totalmess: 0,
				error: ''
			});
        }
    })
}

/**
 *  保存评论内容
 * */
exports.saveMessage = function(blog, hostid, content, type, user){
    return new Promise(function (resolve, reject) {
        Message.findOne({authorID: blog.authorID}, function (err, messlist) {
            if(!messlist){
                var messlist = {
                    authorID: blog.authorID,
                    messageList: [{
                        commentID: user._id,
						commentName: user.name,
						commentIcon: user.icon,
						blogID: blog._id,
						blogName: blog.title,
						hostID: hostid,
						commentContent: content,
						actionType: type,  //1表示喜欢, 2表示评论, 值为3表示回复
						status: 0, //0表示未查看, 1表示已查看
						commentDate: getTimeNow()
                    }]
                };
                var message = new MessgaeSchema(messlist);
                message.save(function (err, data){
					if (err){
						reject('error');
					}else{
						resolve('ok');
					}
				})
            }else{
                var messageList = {
                    commentID: user._id,
                    commentName: user.name,
                    commentIcon: user.icon,
                    blogID: blog._id,
                    blogName: blog.title,
                    hostID: hostid,
                    commentContent: content,
                    actionType: type,  //1表示喜欢, 2表示评论, 值为3表示回复
                    status: 0, //0表示未查看, 1表示已查看
                    commentDate: getTimeNow()
                }
				messlist.messageList.push(messageList);
				messlist.save();
				resolve('ok');
            }
        })
    })
}

// 获取本地时间
function getTimeNow() {
    var date = new Date();
    var seperator1 = '-';
    var seperator2 = ':';
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours()
    var minute = date.getMinutes();
    var second = date.getSeconds();

    month = translateTime(month);
    day = translateTime(day);
    hour = translateTime(hour);
    minute = translateTime(minute);
    second = translateTime(second);

    var currentDate = year + seperator1 + month + seperator1 + day + '' + hour + seperator2 + minute + seperator2 + second;
    return currentDate;
}

// 转化时间
function translateTime(t) {
    if (t >= 0 && t <= 9) {
        return '0' + t;
    }

    return t;
}