const io = require('socket.io')(8080);
//var socket = io('http://localhost');
const redis = require('redis');
const Conversation = require('../model/main')

const conversation = new Conversation()

//conversation.delete_message('love#trivedi')
//conversation.delete_conversation_id('love,trivedi')
//conversation.get_message('love#trivedi')

let users = []

const findUser = username => users.find(user => user.username == username)

io.on('connection', socket => {
  //conversation.get_message('love#trivedi')
    socket.on('newConnection', data => {
    console.log('data')
    console.log(data)
    conversation.get_message('love#trivedi')
        users.push({
            username: data.username,
            socketId: socket.id
        })
    })

    socket.on('sendMessage', data => {

      const conversation_id = conversation.set_conv_id(data.author, data.to)//create conv ID
      console.log("created conv id=>",conversation_id)
      conversation.save_message(data.author, data.to, conversation_id, data.content) // SAVE MESSAGE

      const user = findUser(data.to)
      if (user) socket.broadcast.to(user.socketId).emit('receivedMessage', data)
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})
