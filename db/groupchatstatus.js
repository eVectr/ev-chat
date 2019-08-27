var mongoose = require('mongoose')

var GroupChatStatus = new mongoose.Schema({
  To: String,
  Status: String
})
module.exports = mongoose.model('GroupChatStatus', GroupChatStatus)
