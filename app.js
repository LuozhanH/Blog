/**
 * Created by luozhanhong on 2018/5/9.
 * 应用程序的启动（入口）文件
 */

// 加载express模块
var express = require('express');
// 加载数据库模块
var mongoose = require('mongoose');
// 加载body-parser模块，用于处理post提交过来的数据
var bodyParser = require('body-parser');
// 加载模板处理模块
var swig = require('swig');
//加载Cookies模块
var Cookies = require('cookies');
// 创建APP应用 ==》 node.js Http.createServer()
var app = express();

var User = require('./models/User');

// 设置静态文件托管
// 当用户访问url以public开头，那么直接返回对应的__dirname + '/public下的文件
app.use('/public', express.static( __dirname + '/public' ));

// 配置应用模板
// 定义当前应用所使用的模板引擎
// 第一个参数：表示模板引擎的名称，同时也是模板文件的后缀
// 第二个参数：表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件存放目录
// 第一个参数：必须是views
// 第二个参数：目录
app.set('views', './views');
// 注册所使用的模板引擎
// 第一个参数必须是 view engine
// 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');
// 在开发过程中需要取消模板缓存
swig.setDefaults({cache: false});

// body-parser配置
app.use( bodyParser.json() );

// 跨域配置
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, isadmin');
    next();
});

// Cookies配置
app.use( function (req, res, next) {
    req.cookies = new Cookies(req, res);
    // 解析登陆用户的cookies信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            // 获取当前登陆用户的类型
            User.findById(req.userInfo._id).then((userInfo) => {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch (e) {
            next();
        }
    } else {
        next();
    }
} )

function dateFormat(date, fmt) {
    if (null == date || undefined == date) return '';
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.toJSON = function () { return dateFormat(this,'yyyy-MM-dd hh:mm:ss')}

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/homepage', require('./routers/main'));

// 监听请求
mongoose.connect('mongodb://47.100.163.80:27017/blog', function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库链接成功');
        app.listen(8228);
    }
});

