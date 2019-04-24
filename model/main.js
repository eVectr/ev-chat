
const redis = require('redis');
const express = require('express') ////////////// REMOVE AFTER API TESTING 
var app = express()  /////////////// REMOVE AFTER API TESTING 

let client = redis.createClient();
client.on('connect', ()=>{})

//==================== API TESTING  ==========================/////////


///////////========== CREATE GROUP /////////////////////////
app.get('/group', (req, res, next) =>{

  let groupname = 'group4'
  let admin = "admin4"

  const payload ={
    groupname:groupname,
    user:admin
  }

  client.lrange(groupname, 0, -1,
    (err,data) =>{
  
      if(err){res.send(err)}
      else{
        //  console.log("Admin ==> ", data[0])
          if(data[0] == undefined)
          {
            res.send(data)
            client.rpush(groupname,JSON.stringify(payload))
            console.log("Group Created")
          }  
          else{
            res.send(data)
            console.log(data)
            // console.log("GroupName ==>", data[0].groupname)
             console.log("Admin ==>", JSON.parse(data[0]).user)
          }
         //res.send(data)
      }
  
    })
})//////////////////////////////////////

////////////////////// CHECK USER IN GROUP //////////////////////////////////////////
function checkuser(array, user)
{
   
    let len = array.length;
    for(let i = 0; i< len ; i++)
    {
      if(array[i].user== user){return true}
    }
    return false
}
//////////////////////////////////////////////////////////////////////////

///==============  ADD USER TO GROUP ==================================///////
app.get('/groupuser', (req, res, next) =>{
let groupname = "group4"
let user = "user6"
let maxuser = 5

const payload ={
  groupname:groupname,
  user:user
}
client.lrange(groupname, 0, -1, (err, data) =>{
  if(err){res.send(err)}
  else{

    
     let array = [];
     for (i = 0; i< data.length; i++)
     {
        array.push(JSON.parse(data[i]))
     } 
       
        let getuser =  checkuser(array , user)
        if(getuser == false){
          
          if(array.length <= maxuser){
      
            client.rpush(groupname, JSON.stringify(payload))
            res.send(data)
            console.log(data)
          }else{
            res.send("Max User limit reached")
            console.log("Max User limit reached")
            console.log(data)
           }
          
        }else{
          console.log("user already exist")
          console.log(data)
          res.send(data)
        }
        
      }
    }
) 
  })

//////////////////////////////////// END ///////////////////////////////


/////////////////////// DELETE GROUP ================///////////////
app.get('/delete', (req, res, next) =>{
let groupname = "group4"
client.del("message"+groupname)
client.del(groupname,(err, data)=>{
  if(err){
    console.log('err')
    res.send(err)
  }else{
    console.log('Group deleted')
    res.send("Group deleted")
  }
})
})

///////////======================/////////////////////////////////////


/////////////////////// DELETE USER FROM GROUP ================///////////////
app.get('/remove', (req, res, next) =>{
  let group = "group4"
  let user = "user6"

  client.lrem(group,  0, user, (err)=>{
    if(err){
      res.send(err)
      console.log(err)
    }
    else{
      res.send("User removed")
      console.log("user removed")
    }
  })

})
  
  ///////////======================/////////////////////////////////////

  //////////////////////// SAVE MESSAGE ////////////////////////////////////
  app.get('/save', (req, res, next) =>{
    let groupname = "group4"
    let author = "user1"
    let to = "user2"
    let content = "helo"
    const payload ={
      author:author,
      to:to,
      content:content
    }
    client.rpush("message"+groupname, JSON.stringify(payload));
    client.lrange("message"+groupname , 0, -1,
    (err,data) =>  {
      if(err){
          console.log(err)
      }else{
        //res.send(data)
        //console.log(data)
        console.log("message saved")
    }
  })
  
  })
  //////////////////////////////////////////////////////////////////////////

  //////////////// GET MESSAGE =======================================////////
app.get('/getmessage', (req, res, next) =>{

  let groupname = "group4"
  client.lrange("message"+groupname, 0, -1,
  (err,data) =>{
    if(err){
        res.send(err)
    }else{ 

         let i =0;
         let messagedata = [];
         for (i = 0; i< data.length; i++){
             messagedata.push(JSON.parse(data[i]))
         }
         console.log(messagedata[0])
         res.send(messagedata[0])
 }  
})
})
  ///////////////////////////////////////////////////////////////////////////////

//X X X X X X X X X X X X X END API TESTING  X X X X X X X X  X X X X X  X X X X X X X ///

module.exports = class Conversation {

//--------- CREATE group -----------------------/////
create_group(groupname, admin){

  client.lrange(groupname, 0, -1,
  (err,data) =>{

    if(err){res.send(err)}
    else{
        //console.log("Admin ==> ", data[0])
        if(data[0] == undefined)
        {
          client.rpush(groupname,admin)
          console.log("Group Created")
        }  
        else{
          console.log("admin ==>", data[0])
        }
       res.send(data)
    }

  })
}
///////////// END /////////////////////////////////

////////////////// CHECK USER  /////////////////////////


 checkuser(array, user)
{
    let len = array.length;
    for(let i = 0; i< len ; i++)
    {
      if(array[i]== user){return true}
    }
    return false
}
//////// END ////////////////////////

////////////////// ADD USER TO GROUP ///////////////\\\\\\\\\\\\\\\\\\\
add_user(user){
  client.lrange("group1", 0, -1, (err, data) =>{
    if(err){res.send(err)}
    else{
          let array =[];
          array = data;
          let getuser =  checkuser(array , user)
          if(getuser == false){
            client.rpush("group1", user)
            res.send(data)
          }else{
            console.log("user already exist")
            res.send(data)
          }
          
        }
      }
  ) }
////////// END ////////////////////////////////////////////////////////////////

///////////////// delete group ///////////////////////////////////////

delete_group(group){

  client.del("group",(err, data)=>{
    if(err){
      console.log('err')
      res.send(err)
    }else{
      console.log('deleted')
      res.send("deleted")
    }
  })
}
/////////////////////////////////////////////////////////////

  //--------- CREATE CONVERSATION ID -----------------------/////
 set_conv_id(author , to ) {

    let conversation_id =  author.concat('@'+to);
    let participates = author.concat(','+to);

    let participates1 = participates.split(',')
    let participates2 = participates1[1].concat(',',participates1[0]);

  
    let conversation_id1 = conversation_id.split('@')
    let conversation_id2 = conversation_id1[1].concat('@',conversation_id1[0]);


    client.lrange("conversation"+participates, 0, -1,
    (err,data) =>   {
     if(err){
         console.log(err)
     }else{
       console.log("first data[1]==> ", data[1])
       if (data[1] !== conversation_id ) {
         client.lrange("conversation"+participates2, 0, -1,
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
    get_conv_id(author, to){
      return new Promise((resolve, reject)=>{

        var conversationId;
        let participates = author.concat(','+to);
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

save_message(author, to, conversation_id, content){

    const data ={
      author:author,
      to:to,
      content:content
    }
    client.rpush("message"+conversation_id, JSON.stringify(data));
    client.lrange("message"+conversation_id , 0, -1,
    (err,data) =>  {
      if(err){
          console.log(err)
      }else{
        console.log("message saved")
    }
  })
} //////////// method end /////////////////////

//>>>>>>>>>>>>>>>>>>>>> GET  MESSAGES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
get_message(conversation_id){

  return new Promise((resolve, reject)=>{
  client.lrange("message"+conversation_id, 0, -1,
  (err,data) =>{
    if(err){
        reject(err)
    }else{ 

         let i =0;
         let messagedata = [];
         for (i = 0; i< data.length; i++){
             messagedata.push(JSON.parse(data[i]))
         }
         console.log(messagedata)
         resolve({data:messagedata})
 }  
  })
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

app.listen(4000) ///////////// REMOVE AFTER API TESTING