const redis = require('redis')
const path = require('path')
const express = require('express')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)


const Conversation = require('../model/main')

//let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
let client = redis.createClient();
client.on('connect', ()=>{
    console.log("Redis Connected")
})

const conversation = new Conversation()

let users = []

// app.use((req, res, next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     next();
// })

app.use(express.static(path.join(__dirname, '../build')))

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})


const findUser = username => users.find(user => user.username == username)

io.on('connection', socket => {
    socket.on('newConnection', data => {
      
        users.push({
            username: data.username,
            socketId: socket.id
        })
    })

    socket.on('sendMessage', data => {
        conversation.set_conv_id(data.author, data.to)
        conversation.get_conv_id(data.author, data.to)
       .then(conv=> {conversation.save_message(data.author, data.to, conv, data.content)})

        const user = findUser(data.to)
        if (user) socket.broadcast.to(user.socketId).emit('receivedMessage', data)

    })

    socket.on('join', data => {
        conversation.set_conv_id(data.author, data.to)
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> {conversation.get_message(conv).then(message=>{
                socket.emit('message', message)
        })})
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})

server.listen(6547, () => 'API listeneing')
