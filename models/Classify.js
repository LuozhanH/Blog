/**
 * Created by Luozhanhong on 2018/8/21.
 */
var mongoose = require('mongoose');
var classifySchema = require('../schemas/classifys');

module.exports = mongoose.model('Classify', classifySchema);