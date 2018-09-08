/**
 * Created by Luozhanhong on 2018/8/21.
 */

var mongoose = require('mongoose');
var blogSchema = require('../schemas/blogs');

module.exports = mongoose.model('Blog', blogSchema);