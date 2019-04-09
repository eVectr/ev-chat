const io = require('socket.io')(8080);
//var socket = io('http://localhost');
const redis = require('redis');
const Conversation = require('../model/main')

const conversation = new Conversation()


let users = []

const findUser = username => users.find(user => user.username == username)

io.on('connection', socket => {

    socket.on('newConnection', data => {
      
        users.push({
            username: data.username,
            socketId: socket.id
        })
    })

    socket.on('sendMessage', data => {
      const conversation_id = conversation.set_conv_id(data.author, data.to)//create conv ID
      console.log(conversation_id)
      conversation.save_message(conversation_id, data.content) // SAVE MESSAGE
      const user = findUser(data.to)
      if (user) socket.broadcast.to(user.socketId).emit('receivedMessage', data)
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})
