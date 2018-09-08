/**
 * Created by Luozhanhong on 2018/8/21.
 */
var mongoose = require('mongoose');

// 用户的表结构
module.exports = new mongoose.Schema({
    //分类名
    name: String
})