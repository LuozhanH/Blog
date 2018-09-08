/**
 * Created by Luozhanhong on 2018/5/9.
 */

var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
})

router.get('/', function(req, res, next) {

    var  data = {
        userInfo: req.userInfo,
        categories: [],
        contents: [],
        page: Number(req.query.page || 1),
        limit: 10,
        pages: 0,
        count: 0
    };

    //读取所有分类
    Category.find().then((categories)=>{
        data.categories = categories;
        return Content.count();
    }).then((count)=>{

        data.count = count;
        // 计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        // 取值不能超过pages 两者中取最小值
        data.page = Math.min(data.page, data.pages);
        // 取值不能小于1
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Content.find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then((contents)=>{
        data.contents = contents
        responseData.code = 200;
        responseData.message = '获取首页数据成功';
        responseData.data = data;
        res.json(responseData);
    }).catch(()=>{});

});

module.exports = router;