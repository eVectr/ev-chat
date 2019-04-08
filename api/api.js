const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const redis = require('redis')
var uuid = require('uuid');
const port = 3000 || process.env.PORT

let client = redis.createClient();


client.on('connect', ()=>{
   console.log('connected to redis')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//---------POST CONVERSATION -----------------------/////


app.post('/conversations', (req, res, next ) =>{

const data ={
   author:req.body.author,
   to:req.body.to,
   conversation_id:req.body.conversation_id
 }
 let  conversation_id = req.body.conversation_id
  client.rpush("conversations"+conversation_id,JSON.stringify(data))

  client.lrange("conversations"+conversation_id, 0, -1,
  (err,data) =>
  {
    if(err){
        res.json({message: " error "});
    }else{
     res.send({data})
  }
  })
})
//===================  END   ==================//////////////////////
app.post('/message/', (req, res, next ) =>{
const data ={
   content:req.body.content,
 }

  client.rpush("message"+message_id,JSON.stringify(data))

  client.lrange("message"+message_id, 0, -1,
  (err,data) =>
  {
    if(err){
        res.json({message: " error "});
    }else{
     res.send({data})
  }
  })
})

//----------- GET USER CONVERSATION --------------///////

app.get('/conversations/:conversation_id', (req, res, next ) =>{

  const conversation_id = req.params.conversation_id;

  client.lrange("conversations"+conversation_id, 0, -1,
  (err,data) =>
  {
    if(err){
        res.json({message: " error "});
    }else{
     res.send({data})
  }
  })
})

/////===================  END  =====================///////////

//----------- GET ALL CONVERSATION --------------///////

app.get('/conversations', (req, res, next ) =>{
  client.lrange("conversations", 0, -1,
  (err,data) =>
  {
    if(err){
        res.json({message: " error "});
    }else{
     res.send({data})
  }
  })
})
/////===================  END  =====================///////////


///-----------------------DELETE -----------------////////////
app.delete('/conversations/:conversation_id', (req, res, next ) =>{
  const conversation_id = req.params.conversation_id;
  client.del("conversations"+conversation_id,(err, data)=>{
    if(err){
      res.json({err});
    }else{
      res.json({message: " conversation deleted"});
    }
  })
})

//////////////////////////////////////////////////////////////////

app.listen(port, () => console.log(`Example app listening`))
