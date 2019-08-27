const redis = require('redis');
//let client = redis.createClient()

const GroupNote = require('../db/groupnote')
const Chatgroup = require('../db/chatgroup')
const GroupCounter = require('../db/groupcounter')
const ChatStatus = require('../db/chatstatus')

let convapi = function (app) {

 //////////========== CREATE GROUP /////////////////////////
  
//  app.post('/Creategroup', (req, res, next) =>{
   
//     let groupname = req.body.groupname
//     let groupId = req.body.groupId
//     let admin = req.body.admin
//     let groupcounter = req.body.groupcounter
  
//     const payload ={
//       groupname:groupname,
//       groupId: req.body.groupId,
//       admin:admin,
//       groupcounter: groupcounter
//     }
//     client.lrange("grouplist", 0, -1,
//       (err,data) =>{
  
//         if(err){res.send(err)}
//         else{
            
//               client.rpush("grouplist",JSON.stringify(payload))
//              console.log("group updated")
//            //res.send(data[data.length -1])
//         }
  
//       })
//   })

   //////////////////////// MONGO DB //////////////////////////////////////////////

  app.post('/Creategroup', (req, res, next) => {

    let groupname = req.body.groupname
    let admin = req.body.admin
    let grouplimit = req.body.grouplimit
    let members =  req.body.members
    let groupcounter = req.body.groupcounter
    var chatgroup = new Chatgroup({
      groupname: groupname,
      admin: admin,
      grouplimit: grouplimit,
      members : [admin]
    })
    chatgroup.save((err, data)=>{
      if(err){
       // console.log("mongo db err")
        res.send(err)
      }else{
       // console.log("mongo data =>", data)
        res.send(data)
      }
    })
  })

  ////////////////////////  END MONGO   ///////////////////////////////////
  
//  app.post('/updategroup', (req, res, next) =>{
 
//   let index= req.body.index
//   let groupname = req.body.groupname
//   let groupId = req.body.groupId
//   let admin = req.body.admin
//   let groupcounter = req.body.groupcounter
//   let newgroupcounter = req.body.newgroupcounter

//   let group = {
//     index: index,
//     groupname: groupname,
//     groupId: groupId,
//     admin: admin,
//     groupcounter:groupcounter
//   }
//   let newgroup = {
//     groupname: groupname,
//     groupId: groupId,
//     admin: admin,
//     groupcounter:newgroupcounter
//   }
//       client.lset("grouplist", index, JSON.stringify(newgroup), (err, data)=>{
//        if(err){
//          console.log(err)
//        }else{
//         client.lrange("grouplist", 0, -1,  (err, data)=>{
//           if(err){console.log(err)}
//           else{
//             console.log(" updated data group ", data)
//             let array = []
//             for(let i =0; i< data.length; i++){
//               array.push(JSON.parse(data[i]))
//             }
//             res.send(array)
//           }
//         })
//        }
//       })  
  
//   })//////////////////////////////////////
  
  // app.get('/Getgroup', (req, res, next) =>{
  
  //   client.lrange("grouplist", 0, -1,
  //     (err,data) =>{
  
  //       if(err){res.send(err)}
  //       else{
  //           let groups = []
              
  //             for(let i = 0 ; i<data.length; i++){
  //               groups.push(JSON.parse(data[i]))
  //             }
  //             res.send(groups)
  //             console.log(groups)
            
  //          //res.send(data)
  //       }
  //     })
  // })

/////////////////////// Mongo Get Group //////////////////////////////////////////////////
app.get('/Getgroup', (req, res, next) =>{
  
  Chatgroup.find({}, (err, data)=>{
    if(err){
      //console.log(err)
      res.send(err)
    }else{
      res.send(data)
     // console.log("group mongo data =>", data)
    }
  })
})
///////////////////////////////////////////////////////////////////////////////////

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
  // app.post('/adduser', (req, res, next) =>{
  //   let groupId = req.body.groupId
  //   let users = req.body.users
  //   let maxuser = req.body.maxuser
  //   console.log("max user", maxuser)
  //   client.lrange(groupId, 0, -1, (err, data) => {
  //     if(err){res.send(err)}
  //     else{
  //         console.log(data.length)
  //         if((data.length + users.length) > maxuser){
  //           res.send(false)
  //           return
  //         }
  //         else{
  //            users.map((user)=>{
  //                 client.rpush(groupId, user)
  //                 console.log(data)
  //           }) 
  //          res.send(data)
  //         }
  //       }
  //     }
  //   ) 
  // })

  //============== MONGOOOO ADD USER TO GROUP ==================================///////
  app.post('/adduser', (req, res, next) => {
    let groupId = req.body.groupId
    let users = req.body.users
    console.log("users   ==>", users)
    console.log("Id   ==>", groupId)
    Chatgroup.find({ _id: groupId }, (err, data) => {
      if (err) {
        console.log("ee",err)
        res.send(err)
      } else {
       
        let initialusers = data[0].members
        let updatedusers = initialusers.concat(users)
        console.log("initialusers ==>", initialusers)
        console.log("updatedusers ==>", updatedusers)
        if (data[0].grouplimit >= updatedusers.length) {
          Chatgroup.findOneAndUpdate(
            {
              _id: groupId
            },
            { $set: { members: updatedusers } },
            (err, data) => {
              if (err) {
                res.send(err)
              } else {
                res.send(data)
              }
            }
          )
        }
      }
    })
  })

  //////// Get group user ////////////////////////////
  
  // app.post('/getuser', (req, res, next) =>{
  // let groupId = req.body.groupId
   
  // client.lrange(groupId, 0, -1, (err, data) => {
  //   if(err){res.send(err)}
  //   else{
  //             if(data.length == 0){
  //               res.send("no users")
  //               console.log(groupId)
  //               console.log("no users")
  //             }else{
  //               res.send(data)
  //               //console.log(data)
  //             }
      
  //         }
  //       }
  // ) 
  // })

    //////// MONGOOOOOO Get group user ////////////////////////////

  app.post('/getuser', (req, res, next) => {
    let groupId = req.body.groupId
    console.log("group id === >", groupId)
    Chatgroup.find({_id:groupId}, (err, data)=>{
      if(err){
        //console.log(err)
        res.send(err)
      }else{
        
        res.send(data[0].members)
       // console.log("get group user mongo data =>", data[0].members)
      }
    })
  })
  
  
  // app.get('/Deletegroup', (req, res, next) =>{
  // //let groupname = req.body.item
  //   client.del("grouplist",(err, data)=>{
  //     if(err){
  //       console.log(err)
  //     }else{
  //       console.log("group deleted")
  //       res.send("deleted")
  
  //     }
  //   })
  // })
  
  
  // app.post('/removeuser', (req, res, next) =>{
  //   let groupId = req.body.groupId
  //   let user = req.body.user
  //     client.lrem(groupId, 0, user, (err, data)=>{
  //       if(err){
  //         console.log(err)
  //       }else{
  //         console.log("group deleted")
  //         res.send("deleted")
    
  //       }
  //     })
  //   })

  app.post('/removeuser', (req, res, next) => {
    let groupId = req.body.groupId
    let user = req.body.user
    Chatgroup.find({ _id: groupId }, (err, data) => {
      if (err) {
       // console.log(err)
        res.send(err)
      } else {
        console.log("member data =>", data)
        let initialusers = data[0].members
       // console.log("initia user ==>", initialusers)

        updatedusers = initialusers.filter(function(item) { 
          return item !== user
        })
          Chatgroup.findOneAndUpdate({
            _id: groupId,
          }, { $set: { members: updatedusers } }, (err, data) => {
            if (err) {
              res.send(err)
            } else {
              res.send(data)
            }
          })
      }
    })
  })

/////////////////// group limit ////////////////
// app.post('/grouplimit', (req, res, next) =>{

//   let grouplimit = req.body.grouplimit
//   let groupId = req.body.groupId
//   const payload = {
//     grouplimit:grouplimit,
//     groupId: req.body.groupId,
//   }
 
//   client.lrange("grouplimit"+groupId, 0, -1,
//   (err, data) =>{
//     if(err){res.send(err)}
//     else{
//       if(data.length >1){res.send("full")}
//       else{
//         client.rpush("grouplimit"+groupId,JSON.stringify(payload))
//         console.log("group Limit Added")
//         res.send(data)
//         console.log("limit saved")
//       }
 
//     }
//  })
//  })
 
 
 
//  app.post('/getgrouplimit', (req, res, next) =>{
 
//   let groupId = req.body.groupId
 
//   client.lrange("grouplimit"+groupId, 0, -1,
//   (err, data) =>{
//     if(err){res.send(err)}
//     else{
//     res.send(JSON.parse(data[0]))
//     console.log("res data =>", JSON.parse(data[0]))
//     }
//  })
//  })

 //////////// Mongo get group limit /////////////////////////
  app.post('/getgrouplimit', (req, res, next) => {
    let groupId = req.body.groupId
    Chatgroup.find({ _id: groupId }, (err, data) => {
      if (err) {
       // console.log(err)
        res.send(err)
      } else {
        res.send(data[0])
        //console.log("get group limit  mongo data =>", data[0].grouplimit)
      }
    })
  })

 /////////////////////////////////////////////////////////////////////

  // app.post('/editlimit', (req, res, next) => {

  //   let grouplimit = req.body.grouplimit
  //   let groupId = req.body.groupId
  //   const payload = {
  //     grouplimit: grouplimit,
  //     groupId: req.body.groupId,
  //   }
  //   client.del("grouplimit" + groupId)
  //   client.rpush("grouplimit" + groupId, JSON.stringify(payload))
  //   console.log("group Limit Added")

  //   client.lrange("grouplimit" + groupId, 0, -1,
  //     (err, data) => {
  //       if (err) { res.send(err) }
  //       else {
  //         res.send(JSON.parse(data[0]))
  //         console.log("res data =>", JSON.parse(data[0]))
  //       }
  //     })
  // })

 ///////////////////////// Mongo edit user limit /////////////////////////////////
  app.post('/editlimit', (req, res, next) => {
    let grouplimit = req.body.grouplimit
    let groupId = req.body.groupId

    Chatgroup.findOneAndUpdate({
      _id: groupId
    }, { $set: { grouplimit: grouplimit} }, (err, data) => {
      if (err) {
        res.send(err)
      } else {
        Chatgroup.find({_id: groupId}, (err, data)=>{
          if(err){
            res.send(err)
          }else{
           // console.log("group limit ==>", data[0])
            res.send(data[0])
          }
        })
      }
    })
  })
 

/////////////////// group counter ////////////////
// app.post('/groupcounter', (req, res, next) =>{

//   let groupcounter = req.body.groupcounter
//   let groupId = req.body.groupId
//   const payload = {
//     groupcounter:groupcounter,
//     groupId: req.body.groupId,
//   }
//   client.lrange("groupcounter"+groupId, 0, -1,
//   (err, data) =>{
//     if(err){res.send(err)}
//     else{
//       if(data.length >1){res.send("full")}
//       else{
//         client.rpush("groupcounter"+groupId,JSON.stringify(payload))
//         console.log("group counter Added")
//         res.send(data)
//         console.log("counter saved")
//       }
//     }
//  })
//  })

//  app.post('/editgroupcounter', (req, res, next) =>{
//   console.log("edit counter reached =========================================================")
//  return new Promise((resolve, reject) =>{
//   let groupcounter = req.body.groupcounter
//   let groupId = req.body.groupId

//   client.lrange("groupcounter"+groupId, -1, -1,
//   (err, data) =>{
//     if(err){res.send(err)}
//     else{
//       let temp 
//       if(data.length > 0){
//         temp =  JSON.parse(data[0]).groupcounter + groupcounter
//       }else{
//         temp = groupcounter
//       }
//       const payload = {
//         groupcounter:temp,
//         groupId: req.body.groupId,
//       }
//       client.rpush("groupcounter"+groupId, JSON.stringify(payload))
//       //res.send(JSON.parse(data[0]))
//       console.log("res data =>", (data))
//       resolve()
//     }
//  })
//  })
//  })


 
// app.post('/getgroupcounter', (req, res, next) =>{
//   console.log("get counter reached ============================")
//   let groupId = req.body.groupId
//   let member = req.body.member
//   let db = "groupcounter5".concat(groupId.toString().concat(member))
//       client.lrange(db, -1, -1,
//       (err, data) =>{
//         if(err){reject(err)}
//         else{
//         if(data.length > 0){
//           console.log("get group res counter data =>", JSON.parse(data[0]))
//           res.send(JSON.parse(data[0]))
//         }else{
//           console.log("no counter data")
//           res.send({ groupcounter: 0, groupId: ''})
//         } 
//       }
//      })  
//  })

/////////// Get mongo grooup counter //////////////
app.post('/getgroupcounter', (req, res, next) =>{
 // console.log("get counter reached ============================")
  let groupId = req.body.groupId
  let member = req.body.member
  let Id = groupId.toString().concat(member)
    GroupCounter.find({Id:Id},(err, data)=>{
      if(err){
       // console.log(err)
      }else{
        if(data.length > 0){
          res.send(data[0])
        }else{
         // console.log("no counter data")
          res.send({ groupcounter: 0, groupId: ''})
        }
      }
    })    
 })
//   app.post('/deletegroupcounter', (req, res, next) =>{
//   let groupId = req.body.groupId
//   let member = req.body.member
//   let db = groupId.toString().concat(member)
//   client.del(db, (err, data)=>{
//   if(err){
//     console.log(err)
//   }else{
//     console.log("counter deleted")
//     res.send("group counter deleted")
//   }
// })
// })

////// delete mongo group counter ////
  app.post('/deletegroupcounter', (req, res, next) => {
    let groupId = req.body.groupId
    let member = req.body.member
    let Id = groupId.toString().concat(member)

    GroupCounter.findOneAndUpdate({ Id: Id },
      { $set: { GroupCounter: 0 } },
      (err, data) => {
        if (err) {
          res.send(err)
        } else {
          res.send("deleted")
        //  console.log("Updated group counter to 0 ==>", data)
        }
      }
    )
  })

//  app.post('/removegroup', (req, res, next) =>{
//   let groupname = req.body.groupname
//   let groupId = req.body.groupId
//   let admin = req.body.admin
//   let groupcounter = req.body.groupcounter

//   let group = {
//     groupname: groupname,
//     groupId: groupId,
//     admin: admin,
//     groupcounter: groupcounter
//   }
//   console.log("to be deleted group =>", group)
//     client.lrem("grouplist", 0, JSON.stringify(group), (err, data)=>{
//       if(err){
//         console.log(err)
//       }else{
//         console.log("group deleted")
//         res.send(" group deleted")
  
//       }
//     })
//   })

/////////////////  Remove group mongodb ///////////////////////////////////
app.post('/removegroup', (req, res, next) =>{
  let groupId = req.body.groupId
  Chatgroup.findOneAndRemove({_id:groupId}, (err, data)=>{
    if(err){
      //console.log(err)
    }else{
     // console.log("deleted mongo group ==>", data)
    }
  })   
  })
///////////////////////////////////////////////////////////////////////////

  // app.post('/save_group_note', (req, res, next) => {
  //   let to = req.body.to
  //   let note = req.body.note
  //   let data = {
  //     to: to,
  //     note: note
  //   }
  //   client.rpush("note" + to, JSON.stringify(data),
  //     (err, data) => {
  //       if (err) {
  //         console.log(err)
  //         res.send(err)
  //       } else {
  //         console.log("note saved")
  //         res.send("note saved")

  //       }
  //     })
  // }) 

  ////////////////////////   mongo save group note ////////////////////////////////
  app.post('/save_group_note', (req, res, next) => {
    let to = req.body.to
    let note = req.body.note
    var groupNote = new GroupNote({
      to:to,
      note:note
    })
    groupNote.save((err, data)=>{
      if (err) {
       // console.log(err)
        res.send(err)
      } else {
       // console.log("note saved")
        res.send("note saved")

      }
    })
    
  }) 
  ////////////////////////////////////////////////////////////////////////////////

  // app.post('/get_group_note', (req, res, next) => {

  //   let to = req.body.to
  //   client.lrange("note" + to, -1, -1,
  //     (err, data) => {
  //       if (err) {
  //         console.log(err)
  //         res.send(err)
  //       } else {
  //         console.log(data)
  //         res.send(data)
  //       }
  //     })

  // })

///////////// mongo get group note /////////////////////
  app.post('/get_group_note', (req, res) => {

    let to = req.body.to
    GroupNote.find({to:to}, function(err, data) {
      if (err) {
       // console.log(err)
        res.send(err)
      } else {
       // console.log("group notice mongo data =>", data)
       res.send(data)
      }
    })
  })

  app.post('/teststatus', (req, res) => {
    ChatStatus.find({ ConvId: '123' }, (err, data) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        console.log('data ' , data)
        if (data.length < 1) {
          var chatstatus = new ChatStatus({
            ConvId: '123',
            Status: 'status'
          })
          chatstatus.save()
          res.send("done")
        } else {
          ChatStatus.findOneAndUpdate({ ConvId: '123' }, { $set: { Status: "open" } },
            (err, data) => {
              if (err) {
                res.send(err)
              } else {
                console.log(data)
                res.send(data)
              }
            })
        }
      }
    })
  })
/////////////////////////////////////////
}

module.exports = convapi