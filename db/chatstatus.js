var mongoose = require('mongoose')

var ChatStatus = new mongoose.Schema({
  ConvId: String,
  Status: String
})
module.exports = mongoose.model('ChatStatus', ChatStatus)
