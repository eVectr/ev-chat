
const redis = require('redis');

 const express = require('express') 
 var bodyParser = require('body-parser')
 var app = express()


//let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
let client = redis.createClient()
app.use(bodyParser.json());


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
})



////////////// API //////////////////////////////



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


//////// END ////////////////////////

////////////// ADD USER TO GROUP ///////////////\\\\\\\\\\\\\\\\\\\
// add_user(user){
//   client.lrange("group1", 0, -1, (err, data) =>{
//     if(err){res.send(err)}
//     else{
//           let array =[];
//           array = data;
//           let getuser =  checkuser(array , user)
//           if(getuser == false){
//             client.rpush("group1", user)
//             res.send(data)
//           }else{
//             console.log("user already exist")
//             res.send(data)
//           }
          
//         }
//       }
//   ) 
// }
////////// END ////////////////////////////////////////////////////////////////

///////////////// delete group ///////////////////////////////////////

delete_group(group){

  client.del("grouplist1",(err, data)=>{
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

    if (author && to) {
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
               console.log("conversation_ID ==>", data[1])


             }else{
               client.rpush("conversation"+participates,participates,conversation_id )
               console.log("conversation_id created")
               console.log("conversation_ID ==>", data[1])

        }  }  })

     }else{

       console.log("conversation_id already exist")
     }
   }
   })
    }

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
                     }else{
                      resolve("no id")
                      }
                   }
                 })
               }
              }
          })

      })


   }//////////////// method end ///////////////////

//===================  SAVE MESSAGE   ==================//////////////////////

save_message(author, to, conversation_id, content, DateTime){


    const data ={
      author:author,
      to:to,
      content:content,
      DateTime: DateTime
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



//////////////// Save Read Status //////////////////////////////////

save_status(conversation_id, status){
  return new Promise((resolve, reject)=>{
  client.del("status"+conversation_id)
  client.rpush("status"+conversation_id, status)
  client.lrange("status"+conversation_id , 0, -1,
  (err,data) =>  {
    if(err){
        resolve(console.log(err))
    }else{
      resolve(data[0])
     
  }
})
})
} ////////////////////////////////////////////////////

//////////////// Get Read Status //////////////////////////////////

get_status(conversation_id){
  return new Promise((resolve, reject)=>{
  client.lrange("status"+conversation_id , 0, -1,
  (err,data) =>  {
    if(err){
        reject(err)
    }else{
      console.log("get status =>",data[0])
      resolve(data[0])   
  }
})
})
} ////////////////////////////////////////////////////

///////////////////////////// SAVE GROUP STATUS /////////////////////////////

save_group_status(to, status){
  return new Promise((resolve, reject)=>{
  client.del("status"+to)
  client.rpush("status"+to, status)
  client.lrange("status"+to , 0, -1,
  (err,data) =>  {
    if(err){
        resolve(console.log(err))
    }else{
      resolve(data[0])
     
  }
})
})
} 

//////////////// Get Read Status //////////////////////////////////

get_group_status(to){
  return new Promise((resolve, reject)=>{
  client.lrange("status"+to , 0, -1,
  (err,data) =>  {
    if(err){
        reject(err)
    }else{
      console.log("get group status =>",data[0])
      resolve(data[0])   
  }
})
})
}

/////////////////////////////////////////////////////////////////////////////

//////////////// Update Read Status //////////////////////////////////

update_status(conversation_id, status){
  return new Promise((resolve, reject)=>{
  client.lset("status"+conversation_id , -1, status, 
  (err,data) =>  {
    if(err){
      console.log(err)
        reject(err)
    
    }else{
      console.log("status updated")
      resolve(data)    
  }
})
})
} ////////////////////////////////////////////////////


save_group_message(author, to, content, DateTime, notice){

  const data ={
    author:author,
    to:to,
    content:content,
    DateTime: DateTime,
    notice: notice
  }
  client.rpush("message"+to, JSON.stringify(data));
  client.lrange(to , 0, -1,
  (err,data) =>  {
    if(err){
        console.log(err)
    }else{

      console.log("message saved=>", data)
  }
})
} 



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
  
         resolve({data:messagedata})
 }  
  })
})
} ////////// method end ////////////////////////////
get_group_message(group){
  return new Promise((resolve, reject)=>{
  client.lrange("message"+group, 0, -1,
  (err,data) =>{
    if(err){
        reject(err)
    }else{ 
     
         let i =0;
         let groupmessagedata = [];
         for (i = 0; i< data.length; i++){
             groupmessagedata.push(JSON.parse(data[i]))
         }
         resolve({data:groupmessagedata})
 }  
  })
})
}



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

getusers(groupname){
  return new Promise((resolve, reject)=>{
  client.lrange(groupname, 0, -1, (err, data) => {
    if(err){return(err)}
    else{
              if(data.length == 0){
                console.log(groupname)
                console.log("no users")
                resolve("no users")
              }else{
                console.log(data)
                resolve(data)
              }
      
          }
        }
  )}
  ) 
  }


  editgroupcounter(groupcounter, groupId, members){
    return new Promise((resolve, reject)=>{

      members.data.map((member)=>{

        let db = groupId.toString().concat(member)
        client.lrange("groupcounter1"+db, -1, -1,
        (err, data) =>{
        if(err){reject(err)}
        else{
          let temp 
          if(data.length > 0){
            temp =  JSON.parse(data[0]).groupcounter + groupcounter
          }else{
          temp = groupcounter
        }
        const payload = {
          groupcounter:temp,
          groupId: groupId,
        }
        client.rpush("groupcounter1"+db, JSON.stringify(payload))
        //res.send(JSON.parse(data[0]))
        resolve()
      }
   })
      })
   
})
}

getgroupcounter(groupId, members){
  return new Promise((resolve, reject)=>{

    members.data.map((member)=>{

      let db = groupId.toString().concat(member)
      console.log("get counter reached =============================================================")
      client.lrange("groupcounter1"+db, -1, -1,
      (err, data) =>{
        if(err){reject(err)}
        else{
        resolve(JSON.parse(data[0]))
        console.log("res cccccccccc data =>", JSON.parse(data[0]))
        }
     })
    })
})
}

/////// create collection    ///





} //////////////////// CLASS END /////////////////////////////////////

