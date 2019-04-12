
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

    let participates1 = participates.split(',')
    let participates2 = participates1[1].concat(',',participates1[0]);

    let conversation_id1 = conversation_id.split('#')
    let conversation_id2 = conversation_id1[1].concat('#',conversation_id1[0]);

    //console.log("1st id ==>",conversation_id)
    //console.log("2nd id==>",conversation_id2)

    client.lrange("conversation"+participates, 0, -1,
    (err,data) =>   {
     if(err){
         console.log(err)
     }else{
       console.log("first data[1]==> ", data[1])
       if (data[1] !== conversation_id ) {
         client.lrange("conversation"+participates1, 0, -1,
         (err,data) =>{
           if(err){console.log("err")}
           else{
             console.log("second data[1]==>",data[1])
             if(data[1] == conversation_id2 ){
               console.log("conversation_id already exist")


             }else{
               client.rpush("conversation"+participates,participates,conversation_id )
               console.log("conversation_id created")

        }  }  })

     }else{

       console.log("conversation_id already exist")
     }
   }
   })

 }////////////////// method end ///////////////

  ////////============== GET CONVERSATION ID ================////////////
    get_conv_id(author_id, to_id){
      return new Promise((resolve, reject)=>{

        var conversationId;
        let participates = author_id.concat(','+to_id);
        let participates1 = participates.split(',')
        let participates2 = participates1[1].concat(',',participates1[0]);

         client.lrange("conversation"+participates, 0, -1,
          (err,data) =>
          {
            if(err){
                console.log(err)
                reject(err)
            }else{
               if (typeof(data[1]) != "undefined"){
                  resolve(data[1])
                 console.log(data[1])

               }else{
                 client.lrange("conversation"+participates2, 0, -1,(err,data)=>{
                   if(err){
                     console.log(err)
                     reject(err)
                   }else{
                     if (typeof(data[1]) != "undefined"){
                       resolve(data[1])
                       console.log(data[1])
                     }else{console.log("no id")}
                   }
                 })
               }
              }
          })

      })


   }//////////////// method end ///////////////////

//===================  SAVE MESSAGE   ==================//////////////////////

save_message(author_id, to_id, conversation_id, content){

    const data ={
      author_id:author_id,
      to_id:to_id,
      content:content
    }

    client.rpush("message"+conversation_id, JSON.stringify(data));
    client.lrange("message"+conversation_id , 0, -1,
    (err,response) =>  {
      if(err){
          console.log(err)
      }else{
        console.log("message saved")
    }
  })
} //////////// method end /////////////////////

//>>>>>>>>>>>>>>>>>>>>> GET  MESSAGES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
get_message(conversation_id){
  let i = 0;
  client.lrange("message"+conversation_id, 0, -1,(err,response) =>
  {
    if(err){
          console.log(err)
    }else{
      //return response;
      console.log(response)
      const l = response.length
      for( i = 0; i < l; i++){
      //  console.log(JSON.parse(response[i]).author_id)
        console.log(JSON.parse(response[i]).content)
      //  console.log(JSON.parse(response[i]).to_id)
        console.log("  ")
     }
    }
    })
  } ////////// method end ////////////////////////////

  ///-----------------------DELETE -----------------////////////

delete_message(conversation_id){

      client.del("message"+conversation_id,(err, data)=>{
        if(err){
          console.log(err)
        }else{
          console.log("message deleted")
        }
      })
  } /////// method end ////////////////

delete_conversation_id(participates){
  client.del("conversation"+participates,(err, data)=>{
    if(err){
      console.log('err')
    }else{
      console.log('deleted')
    }
  })
}


} //////////////////// CLASS END /////////////////////////////////////
