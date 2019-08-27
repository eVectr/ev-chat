var mongoose = require('mongoose');

var GroupChat = new mongoose.Schema({
   author: String,
   to:String,
   content:String,
   DateTime:String,
   notice:String
})
module.exports = mongoose.model('GroupChat', GroupChat)
