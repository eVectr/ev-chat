
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const redis = require('redis')
const port = 3030


let client = redis.createClient();
client.on('connect', ()=>{
  console.log('redis connected')

})


  //--------- CREATE CONVERSATION ID -----------------------/////


  app.get('/message:conversation_id', (req, res, next ) =>{

    client.lrange("message"+conversation_id, 0, -1,(err,response) =>
    {
      if(err){
            console.log(err)
      }else{
        res.json({message: " conversation"});
        console.log("data")
        return response
      }
  })
})

app.listen(port, () => console.log(` api listening`))
