var mongoose = require('mongoose');

var ChatGroup = new mongoose.Schema({
    groupname: String,
    groupId: String,
    admin: String
})

module.exports = mongoose.model('ChatGroup', ChatGroup)
