
const redis = require('redis');

let client = redis.createClient();
client.on('connect', ()=>{
  
})

module.exports = class Conversation {

test(){
  console.log('test');
}

  //--------- CREATE CONVERSATION ID -----------------------/////
 set_conv_id(author_id , to_id ) {

    let conversation_id =  author_id.concat('#'+to_id);
    let participates = author_id.concat(','+to_id);

    client.lrange("conversation"+participates, 0, -1, (err,data) =>
    {
        if(err){
          console.log(err)
        }else{
              if(data[1] != conversation_id )
                {
                  client.rpush("conversation"+participates,participates,conversation_id )
                  console.log("conversation_id created")
                }else{
                  console.log("conversation_id already exist")
                  console.log(data)
                }
            }
      })
      return conversation_id;
 }////////////////// method end ///////////////

  ////////============== GET CONVERSATION ID ================////////////
   get_conv_id(){
     let participates = req.params.participates

      client.lrange("conversation"+participates, 0, -1,
       (err,data) =>
       {
         if(err){
             res.json({message: " error "});
         }else{
           console.log(data[1])
           res.send({data})
           }
       })
   }//////////////// method end ///////////////////

//===================  SAVE MESSAGE   ==================//////////////////////

  save_message(conversation_id, content){

    client.rpush("message"+conversation_id,content)
    client.lrange("message"+conversation_id , 0, -1,(err,data) =>
    {
      if(err){
              res.json({message: " error "});
            }else{
              console.log(data)
            }
    })


  } //////////// method end /////////////////////



//>>>>>>>>>>>>>>>>>>>>> GET  MESSAGES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
get_message(conversation_id){

  client.lrange("message"+conversation_id, 0, -1,(err,data) =>
  {
    if(err){
          res.json({message: " error "});
    }else{
          res.send({data})
          console.log(data)
    }
    })
  } ////////// method end ////////////////////////////

  ///-----------------------DELETE -----------------////////////

  delete_message(){

      client.del("message"+conversation_id,(err, data)=>{
        if(err){
          res.json({err});
        }else{
          res.json({message: " conversation deleted"});
        }
      })
  } /////// method end ////////////////


} //////////////////// CLASS END /////////////////////////////////////
