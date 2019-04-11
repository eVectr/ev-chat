const express = require('express')
const app = express()

const io = require('socket.io')(8080);
const redis = require('redis');

let client = redis.createClient();
client.on('connect', ()=>{

})
const Conversation = require('../model/main')


app.get('/message', (req, res, next ) =>{
  const participates = 'love#trivedi'
  client.lrange("message"+participates, 0, -1,
  (err,data) =>
  {
    if(err){
        res.json({message: " error "});
    }else{
      res.send(data)
      console.log(data)
      return data
      }
  })
})


const conversation = new Conversation()

// conversation.delete_message('love#trivedi')
// conversation.delete_conversation_id('love,trivedi')
// conversation.delete_message('trivedi#love')
// conversation.delete_conversation_id('trivedi,love')

//conversation.get_message('love#trivedi')

let users = []

const findUser = username => users.find(user => user.username == username)

io.on('connection', socket => {
  //conversation.get_message('love#trivedi')
    socket.on('newConnection', data => {

        users.push({
            username: data.username,
            socketId: socket.id
        })
    })

    socket.on('sendMessage', data => {

      conversation.set_conv_id(data.author, data.to)//create conv ID
      const conversation_id = conversation.get_conv_id(data.author, data.to)//get conv ID
      console.log("created conv id=>",conversation_id)
      conversation.save_message(data.author, data.to, conversation_id, data.content) // SAVE MESSAGE

      const user = findUser(data.to)
      if (user) socket.broadcast.to(user.socketId).emit('receivedMessage', data)
      console.log(data)
    })

//////================================================================////////////////
    socket.on('join', obj => {
      let conversation_id =  obj.author.concat('#'+obj.to)
      client.lrange("message"+conversation_id, 0, -1,(err,response) =>
      {
        if(err){
              console.log(err)
        }else{
            console.log("response ==>",response)

            const user = findUser(response.to_id)

            if (user)  socket.broadcast.to(user.socketId).emit('receivedMessage', response)
        }
      })
    })
//////////////////////==============================================////////////////////

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })
})

//app.listen(4000, () => console.log(`Example app listening`))
