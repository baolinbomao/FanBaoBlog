var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose')

//将路由文件引入
var route = require('./routes/index');

// 设置端口
var port = process.env.port || 3000;

// 获取express实例
var app = express();

// 设置视图的根目录
app.set('views', './views/pages');

// 设置视图的模版引擎
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// 设置静态资源路径
app.use(express.static('./static'));

// 解析application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 解析application/json
app.use(bodyParser.json());

// 设置session和cookie
app.use(cookieParser())
app.use(session({
    secret: '12345',
    name: 'testapp',
    resave: false,
    saveUninitialized: true,
}));

// 监听端口
app.listen(port);
console.log("Server is runnng on " + port);

// 连接mongodb数据库
mongoose.Promise = global.Promise; // 不加这句会报错
mongoose.connect('mongodb://127.0.0.1/mybolg');
mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
})
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

// 初始化所有路由
route(app);

