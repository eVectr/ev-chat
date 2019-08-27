var mongoose = require('mongoose');

var ChatGroup = new mongoose.Schema({
    groupname: String,
    admin: String,
    grouplimit: Number,
    members: []
})

module.exports = mongoose.model('ChatGroup', ChatGroup)
