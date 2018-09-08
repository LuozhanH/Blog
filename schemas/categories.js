/**
 * Created by Luozhanhong on 2018/5/10.
 */

var mongoose = require('mongoose');

// 用户的表结构
module.exports = new mongoose.Schema({
    //分类名
    name: String
})