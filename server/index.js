const redis = require('redis')
const path = require('path')
const express = require('express')

var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(bodyParser.json());



const Conversation = require('../model/main')
let convapi = require("../model/api");


//let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
let client = redis.createClient();
client.on('connect', ()=>{
    console.log("Redis Connected")

})

const conversation = new Conversation()
conversation.delete_message('Trivedi@Love')
conversation.delete_message('Love@Trivedi')

let users = []

convapi(app)

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

///////////////////////////// API //////////////////////////////////////////////////


    socket.on('sendMessage', data => {
        conversation.set_conv_id(data.author, data.to)
    //     conversation.get_conv_id(data.author, data.to)
    //    .then(conv=> {
    //        conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
    //        conversation.save_status(conv, 'sent')
           
    //     })
    
        const user = findUser(data.to)
        if (user) 
             {   console.log("emit received data =>", data)
                 socket.broadcast.to(user.socketId).emit('receivedMessage', data)
            }else{
                console.log( " nO USER FOUND ")
                console.log("emit received data =>", data)
                conversation.get_conv_id(data.author, data.to)
                 .then(conv=> {
                  conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
                  conversation.save_status(conv, 'sent')           
            })

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
                const user = findUser(member)
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
    //     conversation.get_conv_id(data.author, data.to)
    //     .then(conv=> {
    //         conversation.get_message(conv).then(message=>{
    //             if(message == ""){console.log("no message")}else{
    //             socket.emit('message', message)}
    //     })
        
    // })
    const user = findUser(data.to)
    if (user){
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> 
            {
            if(conv){
                conversation.save_status(conv, 'seen')
                .then(status => { 
                    socket.emit('seen', status)
                    console.log("join status =>", status)
                })
                conversation.get_message(conv).then(message=>{
                    if(message == ""){console.log("no message")}else{
                    socket.emit('message', message)}
            }) 
            }  else{
                socket.emit('seen', 'sent')
            }
            
        }

        )
    }else{
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> {
            if(conv){
                conversation.save_status(conv, 'sent')
                .then(status => { 
                    socket.emit('seen', status)
                    console.log("join status =>", status)
                })
                conversation.get_message(conv).then(message=>{
                    console.log("get_messages =>", message)
                    if(message == ""){console.log("no message")}else{
                    socket.emit('message', message)}
            })
            }else{
                socket.emit('seen', 'sent')
            }
          

        })
    }
})


    socket.on('groupjoin', data => {
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

server.listen(6565, () => {
    console.log("Api Listening")
})

