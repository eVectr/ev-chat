var mongoose = require('mongoose');

var GroupCounter = new mongoose.Schema({
   Id:String,
   groupId:String,
   GroupCounter:Number

})

module.exports = mongoose.model('GroupCounter', GroupCounter)
