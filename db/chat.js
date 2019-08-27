var mongoose = require('mongoose');

var Chat = new mongoose.Schema({
   convId: String,
   author:String,
   to:String,
   content:String,
   DateTime:String

})

module.exports = mongoose.model('Chat', Chat)
