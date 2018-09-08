/**
 * Created by luozhanhong on 2018/5/9.
 */

var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Classify = require('../models/Classify')

// 统一返回的格式
var responseData;

// 时间格式
function dateTran(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
}

router.use(function(req, res, next) {
    if (req.headers.isadmin === 'false' ) {
        //如果当前用户非管理员
        console.log('滚')
        res.json({
            code: 500,
            message: '你没有权限访问'
        });
        return;
    }
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

// 首页
router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

/**
 * 用户管理
 */
router.get('/user', function (req, res) {

    /**
     *  从数据库中读取所有用户
     *
     *  limit（Number）：限制获取的数据条数
     *
     *  skip(2)：忽略数据的条数
     *
     *  每页显示两条
     *  1: 1-2 skip: 0 -> 当前页-1 * limit
     *  2: 3-4 skip: 2
     */

    var page = Number(req.query.page || 1);
    var limit = 5;
    var pages = 0;

    User.count().then((count)=>{

        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过pages 两者中取最小值
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1)*limit;

        // 分页展现数据的实现
        User.find().limit(limit).skip(skip).then((users) => {
            responseData.code = 200;
            responseData.message = '获取用户列表成功';
            responseData.data = {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                limit: limit,
                pages: pages
            }
            res.json(responseData);
            // res.render('admin/user_index', {
            //     userInfo: req.userInfo,
            //     users: users,
            //     page: page,
            //     count: count,
            //     limit: limit,
            //     pages: pages
            // });
            return;
        });
    });

});

/**
 * 分类管理
 */
// 获取分类
router.get('/classify', function (req, res) {
    if(req.query.page == 0) {
        Classify.count().then((count)=>{
            // 全部展现数据的实现
            Classify.find().sort({_id: -1}).limit(100).then((classify) => {
                responseData.code = 200;
                responseData.message = '获取全部分类成功';
                responseData.data = {
                    classify: classify,
                    page: page,
                    count: count,
                    limit: limit,
                    pages: pages
                }
                res.json(responseData);
                return;
            });
        });
    } else {
        var page = Number(req.query.page || 1);
        var limit = 5;
        var pages = 0;

        Classify.count().then((count)=>{

            // 计算总页数
            pages = Math.ceil(count/limit);
            // 取值不能超过pages 两者中取最小值
            page = Math.min(page, pages);
            // 取值不能小于1
            page = Math.max(page, 1);

            var skip = (page - 1)*limit;

            /**
             *  1: 升序
             *  -1: 降序
             * */
            // 分页展现数据的实现
            Classify.find().sort({_id: -1}).limit(limit).skip(skip).then((classify) => {
                responseData.code = 200;
                responseData.message = '获取分类列表成功';
                responseData.data = {
                    classify: classify,
                    page: page,
                    count: count,
                    limit: limit,
                    pages: pages
                }
                res.json(responseData);
                return;
            });
        });
    }
});

// 分类添加
router.post('/classify/add', function (req, res) {
    var name = req.body.name || '';
    //判空
    if( name === '' ) {
        responseData.code = 1;
        responseData.message = '分类名称不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中是否已经存在
    Classify.findOne({
        name: name
    }).then( (rs) => {
        if(rs) {
            //数据库已经存在该标签
            responseData.code = 2;
            responseData.message = '该分类已经存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //数据库中不存在该标签，可以保存
            return new Classify({
                name: name
            }).save();
        }
    }).then( (classify) => {
        responseData.code = 200;
        responseData.message = '添加分类成功';
        res.json(responseData);
        return;
    }).catch((err) => {
    });
});

// 分类删除
router.get('/classify/delete', function (req, res) {
    // 获取传过来的ID
    var id = req.query.id || '';

    Classify.remove({
        _id: id
    }).then(()=>{
        responseData.code = 200;
        responseData.message = '删除成功';
        res.json(responseData);
        return;
    })

});

/**
 * 标签管理
 */
router.get('/category', function (req, res) {
    if(req.query.page == 0) {
        Category.count().then((count)=>{
            // 全部展现数据的实现
            Category.find().sort({_id: -1}).limit(100).then((categories) => {
                responseData.code = 200;
                responseData.message = '获取标签列表成功';
                responseData.data = {
                    userInfo: req.userInfo,
                    categories: categories,
                    page: page,
                    count: count,
                    limit: limit,
                    pages: pages
                }
                res.json(responseData);
                return;
            });
        });
    } else {
        var page = Number(req.query.page || 1);
        var limit = 5;
        var pages = 0;

        Category.count().then((count)=>{

            // 计算总页数
            pages = Math.ceil(count/limit);
            // 取值不能超过pages 两者中取最小值
            page = Math.min(page, pages);
            // 取值不能小于1
            page = Math.max(page, 1);

            var skip = (page - 1)*limit;

            /**
             *  1: 升序
             *  -1: 降序
             * */
            // 分页展现数据的实现
            Category.find().sort({_id: -1}).limit(limit).skip(skip).then((categories) => {
                responseData.code = 200;
                responseData.message = '获取标签列表成功';
                responseData.data = {
                    userInfo: req.userInfo,
                    categories: categories,
                    page: page,
                    count: count,
                    limit: limit,
                    pages: pages
                }
                res.json(responseData);
                return;
            });
        });
    }
});

// 标签的添加和保存
router.post('/category/add', function (req, res) {
    var name = req.body.name || '';
    //判空
    if( name === '' ) {
        responseData.code = 1;
        responseData.message = '标签名称不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中是否已经存在
    Category.findOne({
        name: name
    }).then( (rs) => {
        if(rs) {
            //数据库已经存在该标签
            responseData.code = 2;
            responseData.message = '该标签已经存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //数据库中不存在该标签，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then( (newCategory) => {
        responseData.code = 200;
        responseData.message = '添加标签成功';
        res.json(responseData);
        return;
    }).catch((err) => {
    });
});

// 标签修改保存
router.post('/category/edit', function (req, res) {
    // 获取要修改的标签消息， 并且用表单形式展现出来
    var id = req.body.id || '';
    var name = req.body.name || '';

    //获取要修改的标签信息
    Category.findOne({
        _id: id
    }).then((category)=>{
        if (!category) {
            responseData.code = 1;
            responseData.message = '该标签不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            // 当用户没有做任何修改提交时候
            if (name === category.name) {
                responseData.code = 200;
                responseData.message = '修改成功';
                res.json(responseData);
                return Promise.reject();
            } else {
                // 要修改的标签名称是否已经在数据库中存在
                Category.findOne({
                    _id: {$ne: id},
                    name: name
                }).then( (same) => {
                    if(same) {
                        responseData.code = 2;
                        responseData.message = '数据中以存在同名标签';
                        res.json(responseData);
                        return Promise.reject();
                    } else {
                        return Category.update({
                            _id: id
                        }, {
                            name: name
                        })
                    }
                }).then(() => {
                    responseData.code = 200;
                    responseData.message = '修改成功';
                    res.json(responseData);
                    return;
                }).catch((err) => {
                });
            }
        }
    }).catch((err) => {
    });
});

// 标签的删除
router.get('/category/delete', function (req, res) {
    // 获取传过来的ID
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(()=>{
        responseData.code = 200;
        responseData.message = '删除成功';
        res.json(responseData);
        return;
    })

});

/**
 * 内容管理
 */
router.get('/content', function (req, res) {
    var page = Number(req.query.page || 1);

    var pages = 0;

    var limit;


    if (req.query.page === 'all') {
        limit = 100;
    } else {
        limit = 5;
    }

    Content.count().then((count)=>{

        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过pages 两者中取最小值
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1)*limit;

        var categories = [];

        // Category.find().sort({_id: -1}).then((res)=> {
        //     categories = res;
        // })

        var classifys = [];
        // Classify.find().sort({_id: -1}).then((res)=> {
        //     classifys = res;
        // })

        /**
         *  1: 升序
         *  -1: 降序
         * */
        // 分页展现数据的实现
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category', 'classify']).sort({
            addTime: -1
        }).then((contents) => {
            responseData.code = 200;
            responseData.message = '获取内容列表成功';
            responseData.data = {
                classifys: classifys,
                categories: categories,
                contents: contents,
                page: page,
                count: count,
                limit: limit,
                pages: pages
            }
            res.json(responseData);
            return;
        });
    });
});

// 按照标签查询文章列表
router.get('/content/getlist', function (req, res) {
    var id = req.query.id
    Content.find({
        category: id
    }).populate(['category']).then((list) => {
        responseData.code = 200;
        responseData.message = '获取内容列表成功';
        responseData.data = {
            contents: list
        }
        res.json(responseData);
        return;
    }).catch(()=>{})
})

// 按照分类查询文章列表
router.get('/content/getbyclassify', function (req, res) {
    var id = req.query.id
    Content.find({
        classify: id
    }).then((list) => {
        responseData.code = 200;
        responseData.message = '按分类获取内容列表成功';
        responseData.data = {
            contents: list
        }
        res.json(responseData);
        return;
    }).catch(()=>{})
})

// 内容添加与保存
router.post('/content/add', function (req, res) {

    //判空
    if( req.body.category === '' ) {
        responseData.code = 3;
        responseData.message = '内容标签不能为空';
        res.json(responseData);
        return;
    }
    if( req.body.title === '' ) {
        responseData.code = 4;
        responseData.message = '内容标题不能为空';
        res.json(responseData);
        return;
    }
    if( req.body.classify === '' ) {
        responseData.code = 5;
        responseData.message = '内容分类不能为空';
        res.json(responseData);
        return;
    }

    var addTime = dateTran(new Date())

    //保存数据到数据库
    new Content({
        author: req.body.author,
        category: req.body.category,
        classify: req.body.classify,
        title: req.body.title,
        addTime: addTime,
        description: req.body.description,
        content: req.body.content,
        contenthtml: req.body.contenthtml
    }).save().then(()=>{
        responseData.code = 200;
        responseData.message = '内容保存成功';
        res.json(responseData);
        return;
    })

})

// 内容修改
router.post('/content/edit', function (req, res) {

    var id = req.body._id || '';

    if( req.body.category === '' ) {
        responseData.code = 3;
        responseData.message = '内容标签不能为空';
        res.json(responseData);
        return;
    }
    if( req.body.title === '' ) {
        responseData.code = 4;
        responseData.message = '内容标题不能为空';
        res.json(responseData);
        return;
    }
    if( req.body.classify === '' ) {
        responseData.code = 5;
        responseData.message = '内容分类不能为空';
        res.json(responseData);
        return;
    }

    Content.findOne({
        _id: id
    }).then((content)=>{
        if (!content) {
            responseData.code = 1;
            responseData.message = '指定内容不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            var updateTime = dateTran(new Date())
            Content.update({
                _id: id
            },{
                show: req.body.show,
                updateTime: updateTime,
                category: req.body.category,
                classify: req.body.classify,
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                contenthtml: req.body.contenthtml
            }).then(() => {
                responseData.code = 200;
                responseData.message = '更新成功';
                res.json(responseData);
                return;
            }).catch(()=>{})
        }
    })
});

// 内容删除
router.get('/content/delete', function (req, res) {
    // 获取传过来的ID
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(()=>{
        responseData.code = 200;
        responseData.message = '删除成功';
        res.json(responseData);
        return;
    })

});

// 用于文章的全文阅读（记录阅读量）
router.get('/view',function (req, res) {
    var contentId = req.query.contentid || ''

    Content.findOne({
        _id: contentId
    }).then((content)=>{

        //每次阅读量+1
        content.views++;
        content.save();

        responseData.code = 200;
        responseData.message = '阅读全文成功';
        responseData.data = content;
        res.json(responseData);
        return;
    })
})

module.exports = router;