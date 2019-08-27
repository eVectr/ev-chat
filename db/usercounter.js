var mongoose = require('mongoose')

var UserCounter = new mongoose.Schema({
   Id:String,
   UserCounter:Number
})

module.exports = mongoose.model('UserCounter', UserCounter)
