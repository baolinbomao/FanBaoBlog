var Blog = require('../models/blog')
var User = require('../models/user')
var Message = require('./message')

/**
 *  创建博客内容
 */
exports.createBlog = function (req, res) {
    var blogMess = {
        title: req.body.blogTitle,
        authorID: req.session.user._id,
        content: req.body.blogContent,
        date: getTimeNow(),
        tag: req.body.blogTag,
        attetion_num: 0,
        review_num: 0,
        look_num: 0
    }

    var blog = new Blog(blogMess);
    blog.save(function (err, data) {
        if (err) {
            console.log("Error:" + err);
            res.send(err);
        } else {
            console.log("data:" + data);
            res.redirect('/bloglist');
        }
    })
}

/**
 *  获取所有用户信息、所有文章信息列表
 */
exports.getAllBlog = function (req, res) {
    var user = req.session.user || null;
    Blog.find({}, function (err, bloglist) {
        if (err) {
            console.log('获取文章列表失败：', err)
            return;
        }

        if (!bloglist.length) {
            res.render('blogList', {
                title: '樊宝博客-小帅哥',
                user: user,
                error: '干啥呢，啥都没有！',
                totalMess: 0
            })
        }

        var userList = [];
        for(const lBlog of bloglist){
            userList.push(new Promise(function(resolve, reject){
                User.findOne({_id: lBlog.authorID}, function(err, user){
                    if(user){
                        resolve(user)
                    }else{
                        reject(null)
                    }
                })
            }))
        }

        Promise.all(userList).then(function(userList){
            Message.totalUnreadMess(user._id).then(function(total){
                res.render('blogList', {
                    title: '樊宝博客-小帅哥',
                    user: user,
                    blogList: bloglist,
                    userList: userList,
                    totalMess: total,
                    error: ''
                })
            })
        }).catch(function(err){
            console.log('获取用户信息失败：', err)
        })
    })
}

// 获取某条博客的信息, 并更新浏览次数
exports.getBlog = function (req, res) {
    var blogId = req.params.id;
    var user = req.session.user || null;
    var error = '';

    Blog.find({_id: blogId}, function (err, blog) {
        if(blog === null){
            error = '该文章被主人删除！';
			res.render({
				error: error
			});
        }else{
            //更新文章阅读次数
			var promise1 = updateLook_num(blogid);
			//查找文章作者的信息
			var promise2 = findUser(blog.authorid);
			//查找该博客的所有评论信息
			var promise3 = findReview(blogid);
			//查看未读消息总数
			var promise4 = Message.totalUnreadMess(blog.authorid);

			Promise.all([promise1, promise2, promise3, promise4]).then(function (result){
				res.render('blogdetail', {
					title: blog.title,
					error: error,
					blog: blog,
					user: user,
					author: result[1],
					reviewlist: result[2],
					totalmess: result[3],
				});	
			}).catch(function (err){
				console.log(err);
			});
        }
    })
}

// 更新文章阅读次数
function updateLook_num(blogid){
	return new Promise(function (resolve, reject){
		Blog.update({_id: blogid}, {$inc: {look_num: +1}}, function (err, doc){
			if (err){
				reject('error');
			}else{
				resolve('ok');
			}
		});
	});
}

// 查找文章作者的信息
function findUser(authorid){
	return new Promise(function (resolve, reject){
		User.findOne({_id: authorid}, function (err, user){
			if (err){
				reject('error');
			}else{
				resolve(user);
			}
		});
	});
}

// 查找该博客的所有评论信息
function findReview(blogid){
	return new Promise(function (resolve, reject){
		Review.findOne({blogID: blogid}, function (err, reviews){
			if (err){
				reject('error');
			}else if (reviews){
				resolve(reviews.reviewlist);
			}else{
				resolve(null);
			}
		});
	});
}

// 更新喜欢的次数
exports.updateLike = function (req, res) {
    var blogid = req.query.blogid;
    Blog.update({ _id: blogid }, { $inc: { attetion_num: +1 } }, function (err, blog) {
        if (err) {
            req.send('error')
            return;
        }
        // 向用户的消息列表里存入未查看消息
        Blog.findOne({ _id: blogid }, function (err, blog) {
            Message.saveMessage(blog, '', '', 1, req.session.user)
                .then(function (ok) {
                    res.send('ok');
                }).catch(function (err) {
                    res.send('error');
                });
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