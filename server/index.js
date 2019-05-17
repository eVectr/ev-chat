const redis = require('redis')
const path = require('path')
const express = require('express')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

console.log(process.env.port)


const Conversation = require('../model/main')


//let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
let client = redis.createClient();
client.on('connect', ()=>{
    console.log("Redis Connected")

})

const conversation = new Conversation()
conversation.delete_message('Trivedi@Love')
conversation.delete_message('Love@Trivedi')

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
       .then(conv=> {
           conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
           conversation.save_status(conv, 'sent')
           
        })
    
        const user = findUser(data.to)
        if (user) 
             {
                conversation.get_conv_id(data.author, data.to)
                .then(conv=> {
                    conversation.save_status(conv, 'seen')
                    .then(status => { })
                 })
                
                 socket.broadcast.to(user.socketId).emit('receivedMessage', data)
            }
            conversation.get_conv_id(data.author, data.to)
            .then(conv => {
            conversation.get_status(conv).then(status=>{
                console.log("status ======>>>",status)
                socket.emit('seen', status )
            })
        })

    })

    socket.on('sendGroupMessage', data => {
        socket.emit('groupmessageSent', 'sent')
        conversation.save_group_message(data.author, data.to, data.content, data.DateTime)
        conversation.save_group_status(data.to, 'sent')
        let groupname = data.to
        conversation.getusers(groupname)
        .then(members => {
            members.map((member)=>{
                console.log("member -->", member)
                const user = findUser(member)
                console.log("user ==>", user)
                if (user) 
                {
                    socket.broadcast.to(user.socketId).emit('receivedGroupMessage', data)
                }
                if (user && (member != data.author))  
                {
                     conversation.get_group_status(data.to).then(status=>{
                     console.log("groupstatus ======>>>",status)
                    socket.emit('groupseen', status )
            })      
       
        }
                
    })
})           
})



    socket.on('join', data => {
        conversation.set_conv_id(data.author, data.to)
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> {
            conversation.get_message(conv).then(message=>{
                if(message == ""){console.log("no message")}else{
                socket.emit('message', message)}
        })
        
    })
    conversation.get_conv_id(data.author, data.to)
    .then(conv=> {
       conversation.get_status(conv).then(status =>{
           socket.emit('seen', status)
           console.log("emmited----",status )
       })
    })
    })


    socket.on('groupjoin', data => {
       console.log("data.to =>",data.to)
        conversation.get_group_message(data.to).then(groupmessage=>{
                //console.log("groupmessage=>",groupmessage)
                if(groupmessage == ""){console.log("no message")}else{
                socket.emit('groupmessage', groupmessage)}
       
        })
      
           conversation.get_group_status(data.to).then(status =>{
               socket.emit('groupseen', status)
               console.log("groupemmited----",status )
           })
        

    })


    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})

// io.set('transports', ['websocket'])

server.listen(6547, () => 'API listeneing')
