/**
 * Created by luozhanhong on 2018/5/9.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

// 引入加密算法
var crypto = require('crypto')

// 统一返回的格式
var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
})

function getRandomSalt(){
    return Math.random().toString().slice(2, 5);
}

function cryptPwd(password, salt) {
    // 密码“加盐”
    var saltPassword = password + ':' + salt;

    // 加盐密码的md5值
    var md5 = crypto.createHash('md5');
    var result = md5.update(saltPassword).digest('hex');
    console.log('加盐密码的md5值：%s', result);
    return result;
}

/**
 * 用户注册
 *   注册逻辑：
 *
 *   1. 用户名不能为空
 *   2. 密码不能为空
 *   3. 两次输入密码必须一致
 *
 *   4. 用户名是否已经被注册了
 *          /数据库查询
 */
router.post('/user/register', function(req, res, next) {
    // console.log(req.body);

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var token = cryptPwd(password, getRandomSalt());

    //用户名不能为空
    if(username === '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    //密码不能为空
    if(password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //两次输入密码必须一致
    if(password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册
    User.findOne({
        username: username
    }).then((userInfo) => {
        if( userInfo ) {
            //表示已经存在该用户
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return Promise.reject();
        }
        //保存用户注册信息到数据库中
        var user = new User({
            username: username,
            password: password,
            token: token
        });
        return user.save();
    }).then((newUserInfo) => {
        //验证完毕通过，注册成功
        responseData.code = 200;
        responseData.message = '注册成功';
        res.json(responseData);
        return;
    }).catch((err) => {
    });
});

// 登陆板块
router.post('/user/login', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    //判空操作
    if(username === '' || password === '') {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    //查询数据库中相同用户名和密码是否存在。存在则登陆成功
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if(!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        // 用户名和密码是正确的
        responseData.code = 200;
        responseData.message = '登陆成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            isAdmin: userInfo.isAdmin,
            token: userInfo.token
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username,
            isAdmin: userInfo.isAdmin
        }));
        req.cookies.set('Blog-Token', userInfo._id.toString());
        res.json(responseData);
        return;
    })

});

// 登出板块
router.get('/user/logout',function (req, res) {
    req.cookies.set('userInfo', null);
    req.cookies.set('Blog-Token', null);
    responseData.message = '登出成功'
    res.json(responseData);
    return;
});

// 拉取用户信息
router.post('/user/nowuser', function (req, res) {
    var token = req.body.token
    User.findOne({
        token: token
    }).then((userInfo) => {
        //拉取数据成功
        responseData.code = 200;
        responseData.message = '拉取用户信息成功';
        responseData.data = userInfo
        res.json(responseData);
        return;
    }).catch((err) => {
    });
})

// 获取指定文章的所有评论
router.post('/comment/update', function (req, res) {
    var contendId = req.body.contentid || '';
    var Name = req.body.name || '';

    Content.findOne({
        _id: contendId
    }).then((content)=>{

        var Comment = content.comments

        for (var i = 0; i < Comment.length; i++) {
            if (Comment[i].username === Name) {
                Comment[i].show = !Comment[i].show
                Content.update({
                    _id: contendId
                },{
                    comments: Comment
                }).then(() => {
                    responseData.code = 200;
                    responseData.message = '更新成功';
                    res.json(responseData);
                    return;
                }).catch(()=>{})
            }
        }

        responseData.code = 200
        responseData.message = '审核文章评论成功';
        res.json(responseData);
        return;
    })

})

// 评论提交
router.post('/comment/post', function (req, res) {
    //内容的id
    var contentId = req.body.contentid || '';

    var postData = {
        username: req.body.name,
        email: req.body.email,
        postTime: new Date(),
        content: req.body.content,
        show: false
    };

    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then((content)=>{
        content.comments.push(postData);
        return content.save();
    }).then((newContent)=>{
        responseData.code = 200;
        responseData.message = '评论成功'
        res.json(responseData);
        return;
    })
})

module.exports = router;