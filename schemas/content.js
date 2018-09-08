/**
 * Created by Luozhanhong on 2018/5/10.
 */

var mongoose = require('mongoose');

function dateTran(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
}

// 用户的表结构
module.exports = new mongoose.Schema({

    //关联字段 - 内容分类的id
    classify: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Classify'
    },

    //关联字段 - 内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    user: {

        //关联字段 - 用户的id
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },

    show: {
      type: Boolean,
      default: false
    },

    author: {
      type: String,
      default: ''
    },

    //添加时间
    addTime: {
        type: Date,
        default: dateTran(new Date())
    },
    updateTime: {
        type: Date,
        default: dateTran(new Date())
    },

    //阅读量
    views: {
        type: Number,
        default: 0
    },

    //内容标题
    title: String,

    //简介
    description: {
        type: String,
        default: ''
    },

    //内容
    content: {
        type: String,
        default: ``
    },

    //文章html
    contenthtml: {
        type: String,
        default: ''
    },

    //评论
    comments: {
        type: Array,
        default: []
    },

    // time
    createTime: {
        type: Date,
        default: Date.now
    }
})

