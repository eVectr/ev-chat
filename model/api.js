const redis = require('redis');
let client = redis.createClient()



let convapi = function (app) {

 //////////========== CREATE GROUP /////////////////////////
  
 app.post('/Creategroup', (req, res, next) =>{
   
    let groupname = req.body.groupname
    let groupId = req.body.groupId
    let admin = req.body.admin
  
    const payload ={
      groupname:groupname,
      groupId: req.body.groupId,
      admin:admin
    }
    client.lrange("grouplist", 0, -1,
      (err,data) =>{
  
        if(err){res.send(err)}
        else{
            console.log("Admin ==> ", data[0])
              
              client.rpush("grouplist",JSON.stringify(payload))
             console.log("group created")
             
            
           res.send(data[data.length -1])
        }
  
      })
  })//////////////////////////////////////
  
  app.get('/Getgroup', (req, res, next) =>{
  
    client.lrange("grouplist", 0, -1,
      (err,data) =>{
  
        if(err){res.send(err)}
        else{
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
  
  
  // let checkuser= (array, user) =>
  // {
  //     let len = array.length;
  //     for(let i = 0; i< len ; i++)
  //     {
  //       if(array[i]== user){return true}
  //     }
  //     return false
  // }
  
  //==============  ADD USER TO GROUP ==================================///////
  app.post('/adduser', (req, res, next) =>{
    let groupId = req.body.groupId
    let users = req.body.users
    let maxuser = req.body.maxuser
    console.log("max user", maxuser)
    client.lrange(groupId, 0, -1, (err, data) => {
      if(err){res.send(err)}
      else{
          console.log(data.length)
          if((data.length + users.length) > maxuser){
            res.send(false)
            return
          }
          else{
             users.map((user)=>{
                  client.rpush(groupId, user)
                  console.log(data)
            }) 
           res.send(data)
          }
        }
      }
    ) 
  })
  //////// Get group user ////////////////////////////
  
  app.post('/getuser', (req, res, next) =>{
  let groupId = req.body.groupId
   
  client.lrange(groupId, 0, -1, (err, data) => {
    if(err){res.send(err)}
    else{
              if(data.length == 0){
                res.send("no users")
                console.log(groupId)
                console.log("no users")
              }else{
                res.send(data)
                //console.log(data)
              }
      
          }
        }
  ) 
  })
  
  
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

  app.get('/delete_conv_id', (req, res, next) =>{

    participats = "Love,Trivedi"
  
    client.del("conversation"+participats,(err, data)=>{
      if(err){
        console.log('err')
      }else{
        res.send("deleted")
        console.log('deleted')
      }
    })
    })
  
  
  app.post('/removeuser', (req, res, next) =>{
    let groupId = req.body.groupId
    let user = req.body.user
      client.lrem(groupId, 0, user, (err, data)=>{
        if(err){
          console.log(err)
        }else{
          console.log("group deleted")
          res.send("deleted")
    
        }
      })
    })
  
}

module.exports = convapi;