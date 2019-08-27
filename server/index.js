const redis = require('redis')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')

var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(bodyParser.json())


const Conversation = require('../model/main')
let convapi = require("../model/api");


mongoose.connect('mongodb://contact:contact123@ds337377.mlab.com:37377/contact',  (err) => {
   if (err) throw err;
   console.log('Mongoose connected')
})

//let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
// let client = redis.createClient();
// client.on('connect', ()=>{
//     //console.log("Redis Connected")

// })

const conversation = new Conversation()
// conversation.delete_message('Trivedi@Love')
// conversation.delete_message('Love@Trivedi')
// conversation.delete_conversation_id()

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
    //     conversation.get_conv_id(data.author, data.to)
    //    .then(conv=> {
    //        conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
    //        conversation.save_status(conv, 'sent')
           
    //     })
    
        const user = findUser(data.to)
        if (user) 
             {
                socket.broadcast.to(user.socketId).emit('receivedMessage', data)
                conversation.get_conv_id(data.author, data.to)
                .then(conv=> {
                   conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
                   conversation.save_status(conv, 'seen')           
             })
            }else{
                
                console.log( " NO USER FOUND ")
                let payload = {
                    Type : 'Missed Chat Message',
                    SentBy: [data.author],
                    SentTo: data.to,
                    ReceiverId: data.ReceiverId
                    
                }
                socket.emit('missedchat', payload )
                conversation.get_conv_id(data.author, data.to)
                 .then(conv=> {
                  conversation.save_message(data.author, data.to, conv, data.content, data.DateTime)
                  conversation.save_status(conv, 'sent')           
            })

            }
            conversation.get_conv_id(data.author, data.to)
            .then(conv => {
            conversation.get_status(conv).then(status=>{
               // console.log("status ======>>>",status)
                socket.emit('seen', status )
            })
        })

    })

    socket.on('sendGroupMessage', data => {
        
        console.log("counter data =>", data)
        socket.emit('groupmessageSent', 'sent')
        conversation.save_group_message(data.author, data.to, data.content, data.DateTime, data.notice)
        conversation.save_group_status(data.to, 'sent')
        let groupname = data.to
        conversation.getusers(groupname)
        .then(members => {
           // console.log("all group mongo members =>", members)
            members.map((member)=>{
                const user = findUser(member)
                console.log("user ==>", user)
                if (user) 
                {
                    socket.broadcast.to(user.socketId).emit('receivedGroupMessage', data)
                   
                }
                if (user && (member != data.author))  
                {
                    //  conversation.get_group_status(data.to).then(status=>{
                    //  socket.emit('groupseen', status )   
                    // })      
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
        .then(conv=> {
            conversation.save_status(conv, 'seen')
            .then(status => { 
                socket.emit('seen', status)
               // console.log("join status =>", status)
            })
            conversation.get_message(conv).then(message=>{
                //console.log("get message ==>", message)
                if(message == ""){console.log("no message")}else{
                socket.emit('message', message)}
        })  
        })
    }else{
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> {
            conversation.save_status(conv, 'sent')
            .then(status => { 
                socket.emit('seen', status)
               // console.log("join status =>", status)
            })
            conversation.get_message(conv).then(message=>{
                //console.log("get message ==>", message)
                if(message == ""){console.log("no message")}else{
                socket.emit('message', message)}
        })
        })
    }
})


    socket.on('groupjoin', data => {
       // socket.emit('delete_counter', data.to)
        conversation.get_group_message(data.to).then(groupmessage=>{
                console.log("groupmessage=>",groupmessage)
                if(groupmessage == ""){console.log("no message")}else{
                socket.emit('groupmessage', groupmessage)}
       
        })
        let delete_data = {
            groupId: data.to,
            member: data.author
        }
        socket.emit('delete_counter', delete_data)
      
        //    conversation.get_group_status(data.to).then(status =>{
        //        socket.emit('groupseen', status)
        //        console.log("groupemmited----",status )
        //    })
    })

    socket.on('add_member', members =>{
        members.map((member)=>{
            const user = findUser(member)
            if (user) 
            {
               // console.log("add_member =>" ,user)
                socket.broadcast.to(user.socketId).emit('get_add_members', 'data')
            }         
  })
}) 


  ////////////  Remove member reload

  socket.on('remove_member', member =>{
        const user = findUser(member)
        if (user) 
        {
            socket.broadcast.to(user.socketId).emit('get_remove_members', 'data')
        }         

}) ///////////////////////

////////////  Delete group reload

socket.on('delete_group', members =>{
    //console.log("delete group memeber =>", members)
    members.map((member)=>{
        const user = findUser(member)
        if (user) 
        {
            socket.broadcast.to(user.socketId).emit('get_delete_group', 'data')
        }         
})         

}) ///////////////////////



    socket.on('set_counter', counter_data => {
        //console.log("set counter emited")

        conversation.editgroupcounter(counter_data.groupcounter, counter_data.groupId, counter_data.members)
            .then(res => {
                conversation.getgroupcounter(counter_data.groupId, counter_data.members)
                    .then(res => {
                        // console.log("res hhhhhh data =>", res.groupcounter)
                        socket.emit('get_counter', res)
                    })

            })
    })

    socket.on('sendGroupCounter', group_counter_data =>{
        conversation.setgroupcounter(group_counter_data.groupcounter, group_counter_data.groupId, group_counter_data.members,
            group_counter_data.author )
        .then(res =>{
        })
    })

    socket.on('get_group_counter', data =>{
        conversation.getgroupcounter(data.groupId, data.member)
        .then(res =>{
            socket.emit('resolved_group_counter', res)
        })
    })

    
    socket.on('send_user_counter', counter_data =>{
        conversation.setusercounter(counter_data.users, counter_data.receiver, counter_data.sender)
        .then(res =>{
           //console.log("res =>", res)
        })
    })

    socket.on('get_user_counter', data =>{
        conversation.getusercounter(data.users, data.receiver, data.sender)
        // .then(res =>{
        //     socket.emit('receive_user_counter', res)
        // })
    })
    
    socket.on('delete_counter', delete_counter_data => {
        // conversation.updatecounter(counter_data.groupcounter, counter_data.groupId, counter_data.members)
       // console.log("delete_counter_data", delete_counter_data)


    }) 

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})



server.listen(6565, () => {
    console.log("Api Listening")
})

