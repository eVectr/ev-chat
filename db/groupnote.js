var mongoose = require('mongoose');

var GroupNote = new mongoose.Schema({
   to: String,
   note: String
})

module.exports = mongoose.model('GroupNote', GroupNote)
