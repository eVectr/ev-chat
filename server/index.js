
const io = require('socket.io')(8080)
const express = require('express')
const app = express()
const redis = require('redis');
const Conversation = require('../model/main')

let client = redis.createClient();
client.on('connect', ()=>{

})

const conversation = new Conversation()

// conversation.delete_message('love@trivedi')
// conversation.delete_conversation_id('love,trivedi')
// conversation.delete_message('love@ajay')
// conversation.delete_conversation_id('love,ajay')


let users = []

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
})

app.get('/message/:conversation_id', (req, res, next ) =>{
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  conversation_id = req.params.conversation_id;
  client.lrange("message"+conversation_id, 0, -1,
  (err,data) =>{
    if(err){
        res.json({message: " error "});
        console.log(err);
    }else{ 
      
        //console.log(JSON.parse(data))
        console.log('data == >',data)
         let i =0;
         let messagedata = [];
         for (i = 0; i< data.length; i++){
             messagedata.push(JSON.parse(data[i]))
         }
         console.log(messagedata)
         res.send({data:messagedata})
 }

    
  })
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

    socket.on('join', data =>{
        conversation.get_conv_id(data.author, data.to)
        .then(conv=> {conversation.get_message(conv).then(message=>{
                socket.emit('message', message)
        })})
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})
app.listen(3030, () => console.log(`API  listening`))
