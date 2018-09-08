/**
 * Created by Luozhanhong on 2018/5/10.
 */

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/content');

module.exports = mongoose.model('Content', contentsSchema);