
const redis = require('redis');

 const express = require('express') ////////////// REMOVE AFTER API TESTING
 var bodyParser = require('body-parser')
 const router = express.Router()
 var app = express()


let client = redis.createClient({ host: '209.97.142.219', port: '6379' });
//let client = redis.createClient()
//client.on('connect', ()=>{})
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
})

//////////========== CREATE GROUP /////////////////////////

app.post('/Creategroup', (req, res, next) =>{
  var today = new Date()
  var second = today.getSeconds();
  let groupname = req.body.groupname
  let user = req.body.user 

  const payload ={
    groupname:groupname,
    groupId: second * Math.floor(Math.random() * 100000000000000000),
    user:user
  }
  client.lrange("grouplist", 0, -1,
    (err,data) =>{

      if(err){res.send(err)}
      else{
        //  console.log("Admin ==> ", data[0])
            
            client.rpush("grouplist",JSON.stringify(payload))
            res.send("group created")
           
          
         //res.send(data)
      }

    })
})//////////////////////////////////////

app.get('/Getgroup', (req, res, next) =>{

  client.lrange("grouplist", 0, -1,
    (err,data) =>{

      if(err){res.send(err)}
      else{
        //  console.log("Admin ==> ", data[0])
          let groups = []
            
            for(let i = 0 ; i<data.length; i++){
              groups.push(JSON.parse(data[i]))
            }
            res.send(groups)
            console.log(groups)
          
         //res.send(data)
      }
    })
})
///////////////////////////// Check user //////////////


let checkuser= (array, user) =>
{
    let len = array.length;
    for(let i = 0; i< len ; i++)
    {
      if(array[i]== user){return true}
    }
    return false
}

//==============  ADD USER TO GROUP ==================================///////
app.post('/adduser', (req, res, next) =>{
  let groupname = req.body.groupname
  let users = req.body.users
  let maxuser = req.body.maxuser
  console.log("max user", maxuser)
  client.lrange(groupname, 0, -1, (err, data) => {
    if(err){res.send(err)}
    else{
        console.log(data.length)
        if((data.length + users.length) > maxuser){
          //res.send("Max user limit reached")
          console.log("max user limit reached")
        }
        else{
          let userarray =[];
          userarray = data;
        
           users.map((user)=>{
            let getuser =  checkuser(userarray , user)
             if(getuser == false){
                client.rpush(groupname, user)
                console.log(data)
              }else{
                //res.send("user already exist")
                console.log("user already exist")
            }
          }) 
         res.send(data)
        }
      }
    }
  ) 
})
//////// Get group user ////////////////////////////

app.post('/getuser', (req, res, next) =>{
let groupname = req.body.groupname
 
client.lrange(groupname, 0, -1, (err, data) => {
  if(err){res.send(err)}
  else{
            if(data.length == 0){
              res.send("no users")
              console.log(groupname)
              console.log("no users")
            }else{
              res.send(data)
              //console.log(data)
            }
    
        }
      }
) 
})

////////////////////// get group users ////////////////////
// app.get('/getuser', (req, res, next) =>{
 
//  let groupname = "group1"
//   client.lrange(groupname, 0, -1, (err, data) =>{
//     if(err){res.send(err)}
//     else{
    
//       let groupusers = []
            
//       for(let i = 0 ; i<data.length; i++){
//         groupusers.push(JSON.parse(data[i]))
//       }
//       res.send(groupusers)
//       console.log(groupusers)
      
//       }
  
//         }
//   )
// })



// /////////////////////////////

app.get('/Deletegroup', (req, res, next) =>{

//let groupname = req.body.item
  client.del("grouplist",(err, data)=>{
    if(err){
      console.log(err)
    }else{
      console.log("group deleted")
      res.send("deleted")

    }
  })
})


app.post('/removeuser', (req, res, next) =>{
  let groupname = req.body.groupname
  let user = req.body.user
    client.lrem(groupname, 0, user, (err, data)=>{
      if(err){
        console.log(err)
      }else{
        console.log("group deleted")
        res.send("deleted")
  
      }
    })
  })
/////////////////////////

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
                     }else{console.log("no id")}
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



save_group_message(author, to, content, DateTime){

  const data ={
    author:author,
    to:to,
    content:content,
    DateTime: DateTime
  }
  client.rpush("message"+to, JSON.stringify(data));
  client.lrange(to , 0, -1,
  (err,data) =>  {
    if(err){
        console.log(err)
    }else{
      console.log("message saved")
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

} //////////////////// CLASS END /////////////////////////////////////

app.listen(5000)