var mongoose = require('mongoose');

var ConvId = new mongoose.Schema({
   convId: String,
   member1: String,
   member2:String

})

module.exports = mongoose.model('ConvId', ConvId)
