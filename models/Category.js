/**
 * Created by Luozhanhong on 2018/5/10.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/categories');

module.exports = mongoose.model('Category', usersSchema);