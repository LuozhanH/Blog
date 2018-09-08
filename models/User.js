/**
 * Created by Luozhanhong on 2018/5/9.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User', usersSchema);