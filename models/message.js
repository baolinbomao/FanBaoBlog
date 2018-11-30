var mongoose = require('mongoose');
var Messgae = require('../schemas/message');

module.exports = mongoose.model('Messgae', Messgae);