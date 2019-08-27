
const redis = require('redis');
const express = require('express')
var bodyParser = require('body-parser')
var app = express()

const Chat = require('../db/chat')
const ConvId = require('../db/convId')
const GroupChat = require('../db/groupchat')
const Chatgroup = require('../db/chatgroup')
const GroupCounter = require('../db/groupcounter')
const UserCounter = require('../db/usercounter')
const ChatStatus = require('../db/chatstatus')
const GroupChatStatus = require('../db/groupchatstatus')

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
// create_group(groupname, admin){

//   client.lrange(groupname, 0, -1,
//   (err,data) =>{

//     if(err){res.send(err)}
//     else{
//         //console.log("Admin ==> ", data[0])
//         if(data[0] == undefined)
//         {
//           client.rpush(groupname,admin)
//           console.log("Group Created")
//         }  
//         else{
//           console.log("admin ==>", data[0])
//         }
//        res.send(data)
//     }

//   })
// }
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

// delete_group(group){

//   client.del("grouplist1",(err, data)=>{
//     if(err){
//       console.log('err')
//       res.send(err)
//     }else{
//       console.log('deleted')
//       res.send("deleted")
//     }
//   })
// }
/////////////////////////////////////////////////////////////

  //--------- CREATE CONVERSATION ID -----------------------/////
  // set_conv_id(author, to) {
  //   if (author && to) {
  //     let conversation_id = author.concat('@' + to)
  //     let participates = author.concat(',' + to);
  //     let participates1 = participates.split(',')
  //     let participates2 = participates1[1].concat(',', participates1[0])
  //     let conversation_id1 = conversation_id.split('@')
  //     let conversation_id2 = conversation_id1[1].concat('@', conversation_id1[0])

  //     client.lrange("conversation" + participates, 0, -1,
  //       (err, data) => {
  //         if (err) {
  //           console.log(err)
  //         } else {
  //           console.log("first data[1]==> ", data[1])
  //           if (data[1] !== conversation_id) {
  //             client.lrange("conversation" + participates2, 0, -1,
  //               (err, data) => {
  //                 if (err) { console.log("err") }
  //                 else {
  //                   console.log("second data[1]==>", data[1])
  //                   if (data[1] == conversation_id2) {
  //                     console.log("conversation_id already exist")
  //                     console.log("conversation_ID ==>", data[1])


  //                   } else {
  //                     client.rpush("conversation" + participates, participates, conversation_id)
  //                     console.log("conversation_id created")
  //                     console.log("conversation_ID ==>", data[1])

  //                   }
  //                 }
  //               })

  //           } else {
  //             console.log("conversation_id already exist")
  //           }
  //         }
  //       })
  //   }
  // }////////////////// method end ///////////////

  /////////////////////////// SET MONGO CONV ID  //////////////////////////////

   //--------- CREATE CONVERSATION ID -----------------------/////
   set_conv_id(sender, receiver) {
    //console.log("author jned =>", sender)
    if (sender && receiver) {
      let conversation_id = sender.concat('@' + receiver)
      let participates = sender.concat(',' + receiver);
      let participates1 = participates.split(',')
      let participates2 = participates1[1].concat(',', participates1[0])
      let conversation_id1 = conversation_id.split('@')
      let conversation_id2 = conversation_id1[1].concat('@', conversation_id1[0])

      ConvId.find({ convId:conversation_id}, (err, data)=>{
        if(err){
        //  console.log("errr === >", err)
        }else{
           if(data.length < 1){
              ConvId.find({ convId:conversation_id2}, (err, data)=>{
               if(err){
               //  console.log(err)
               }else{
                 if(data.length < 1){
                   var convId  = new ConvId({
                    convId:conversation_id,
                    member1:sender,
                    member2:receiver
                  })
                  convId.save()
                }else{
                 // console.log("conversationid already exits", data )
                }
              }
            })
          }else{
           //// console.log("conversationid already exits ==>", data )
          }
        }
      })
    }
  }
  /////////////////////////////////////////////////////////////////////////////

  ////////============== GET CONVERSATION ID ================////////////
  //   get_conv_id(author, to){
  //     return new Promise((resolve, reject)=>{

       
  //       let participates = author.concat(','+to);
  //       let participates1 = participates.split(',')
  //       let participates2 = participates1[1].concat(',',participates1[0]);

  //        client.lrange("conversation"+participates, 0, -1,
  //         (err,data) =>
  //         {
  //           if(err){
  //               console.log(err)
  //               reject(err)
  //           }else{
  //              if (typeof(data[1]) != "undefined"){
  //                 resolve(data[1])
  //                 console.log(data[1])
  //              }else{
  //                client.lrange("conversation"+participates2, 0, -1,(err,data)=>{
  //                  if(err){
  //                    console.log(err)
  //                    reject(err)
  //                  }else{
  //                    if (typeof(data[1]) != "undefined"){
  //                     resolve(data[1])
  //                      console.log(data[1])
  //                    }else{
  //                     resolve("no id")
  //                     }
  //                  }
  //                })
  //              }}
  //         })
  //     })
  //  }//////////////// method end ///////////////////

    ////////============== GET MONGO CONVERSATION ID ================////////////
  get_conv_id(author, to) {
    return new Promise((resolve, reject) => {
      let conversation_id = author.concat('@' + to)
      let conversation_id1 = conversation_id.split('@')
      let conversation_id2 = conversation_id1[1].concat('@', conversation_id1[0])
      ConvId.find({ convId: conversation_id }, (err, data) => {
        if (err) {  }
        else {
         // console.log("test convid ==>", data)
          if (data.length < 1) {
            ConvId.find({ convId: conversation_id2 }, (err, data) => {
              if (err) {
               // console.log(err)
              } else {
                if (data.length<1) {
                //  console.log("no id")
                  reject("no id")
                } else {
                //  console.log("data.convId =>", data[0].convId)
                  resolve(data[0].convId)
                }
              }
            })
          }else{
           // console.log("data.convId =>", data[0].convId)
            resolve(data[0].convId)
          }
        }
      })
    })
  }//////////////// method end ///////////////////

//===================  SAVE MESSAGE   ==================//////////////////////

// save_message(author, to, conversation_id, content, DateTime){

//     const data ={
//       author:author,
//       to:to,
//       content:content,
//       DateTime: DateTime
//     }
//     client.rpush("message"+conversation_id, JSON.stringify(data));
//     client.lrange("message"+conversation_id , 0, -1,
//     (err,data) =>  {
//       if(err){
//           console.log(err)
//       }else{
//         console.log("message saved")
//     }
//   })
// } //////////// method end /////////////////////

////////////// SAVE MONGO MESSAGE ///////////////////
save_message(sender, receiver, conversation_id, content, DateTime){

   var chat  = new Chat({
    convId:conversation_id,
    author:sender,
    to:receiver,
    content:content,
    DateTime:DateTime
  })
  chat.save()
  
}

//////////////// Save Read Status //////////////////////////////////

  // save_status(conversation_id, status) { //////////////////  mongo save status
  //   return new Promise((resolve, reject) => {
  //     var chatstatus = new ChatStatus({
  //       ConversationId: conversation_id,
  //       Status: status
  //     })
  //     chatstatus.save((err, data)=>{
  //       if(err){
  //         reject(err)
  //       }else{
  //         resolve(data[0])
  //       }
  //     })
  //   })
  // } 


  save_status(conversation_id, status) {
    return new Promise((resolve, reject) => {
      client.del("status" + conversation_id)
      client.rpush("status" + conversation_id, status)
      client.lrange("status" + conversation_id, 0, -1,
        (err, data) => {
          if (err) {
            resolve(console.log(err))
          } else {
            resolve(data[0])
          }
        })
    })
  } 

//////////////// Get Read Status //////////////////////////////////


  // get_status(conversation_id) {
  //   return new Promise((resolve, reject) => {
  //     ChatStatus.find({ConversationId:conversation_id}, (err, data)=>{
  //       if(err){
  //         reject(err)
  //       }else{
  //         resolve(data[0])
  //       }
  //     })
  //   })
  // }

  get_status(conversation_id) {
    return new Promise((resolve, reject) => {
      client.lrange("status" + conversation_id, 0, -1,
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            //console.log("get status =>", data[0])
            resolve(data[0])
          }
        })
    })
  } 

///////////////////////////// SAVE GROUP STATUS /////////////////////////////

// save_group_status(to, status) {   ///////// Save mongo group status
//   return new Promise((resolve, reject) => {
//     var groupchatstatus = new GroupChatStatus({
//       To: to,
//       Status: status
//     })
//     groupchatstatus.save((err, data)=>{
//       if(err){
//         reject(err)
//       }else{
//         resolve(data[0])
//       }
//     })
//   })
// } 


  save_group_status(to, status) {
    return new Promise((resolve, reject) => {
      client.del("status" + to)
      client.rpush("status" + to, status)
      client.lrange("status" + to, 0, -1,
        (err, data) => {
          if (err) {
            resolve(console.log(err))
          } else {
            resolve(data[0])
          }
        })
    })
  } 

//////////////// Get Read Status //////////////////////////////////

  // get_status(to) {
  //   return new Promise((resolve, reject) => {
  //     GroupChatStatus.find({ To: to }, (err, data) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(data[0])
  //       }
  //     })
  //   })
  // }

  get_group_status(to) {
    return new Promise((resolve, reject) => {
      client.lrange("status" + to, 0, -1,
        (err, data) => {
          if (err) {
            reject(err)
          } else {
        //    console.log("get group status =>", data[0])
            resolve(data[0])
          }
        })
    })
  }

/////////////////////////////////////////////////////////////////////////////

//////////////// Update Read Status //////////////////////////////////


  // update_status(conversation_id, status) {
  //   return new Promise((resolve, reject) => {
  //     ChatStatus.findOneAndUpdate(
  //       {
  //         ConversationId: conversation_id
  //       },
  //       { $set: { Status: status } },
  //       (err, data) => {
  //         if (err) {
  //           res.send(err)
  //         } else {
  //           res.send(data[0])
  //         }
  //       }
  //     )
  //   })
  // } 
  update_status(conversation_id, status) {
    return new Promise((resolve, reject) => {
      client.lset("status" + conversation_id, -1, status,
        (err, data) => {
          if (err) {
           // console.log(err)
            reject(err)

          } else {
          //  console.log("status updated")
            resolve(data)
          }
        })
    })
  } ////////////////////////////////////////////////////


  // save_group_message(author, to, content, DateTime, notice) {

  //   const data = {
  //     author: author,
  //     to: to,
  //     content: content,
  //     DateTime: DateTime,
  //     notice: notice
  //   }
  //   client.rpush("message" + to, JSON.stringify(data));
  //   client.lrange(to, 0, -1,
  //     (err, data) => {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         console.log("message saved")
  //       }
  //     })
  // } 

  ///////////////// group mongo message ///////////////////

  save_group_message(author, to, content, DateTime, notice) {

    var groupchat = new GroupChat({
      author: author,
      to: to,
      content: content,
      DateTime: DateTime,
      notice:notice
    })
    groupchat.save()
  } 

//>>>>>>>>>>>>>>>>>>>>> GET  MESSAGES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
  // get_message(conversation_id) {
  //   return new Promise((resolve, reject) => {
  //     client.lrange("message" + conversation_id, 0, -1,
  //       (err, data) => {
  //         if (err) {
  //           reject(err)
  //         } else {

  //           let i = 0;
  //           let messagedata = [];
  //           for (i = 0; i < data.length; i++) {
  //             messagedata.push(JSON.parse(data[i]))
  //           }

  //           resolve({ data: messagedata })
  //         }
  //       })
  //   })
  // } ////////// method end ////////////////////////////


  //>>>>>>>>>>>>>>>>>>>>> GET MONGO  MESSAGES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
  get_message(conversation_id) {
    return new Promise((resolve, reject) => {
     Chat.find({convId:conversation_id}, (err, data)=>{
       if(err){
        reject(err)
       }else{
        // console.log("mongo message data =>", data)
         resolve({ data: data})
       }
     })
    })
  } ////////// method end ////////////////////////////

  // get_group_message(group) {
  //   return new Promise((resolve, reject) => {
  //     client.lrange("message" + group, 0, -1,
  //       (err, data) => {
  //         if (err) {
  //           reject(err)
  //         } else {

  //           let i = 0;
  //           let groupmessagedata = [];
  //           for (i = 0; i < data.length; i++) {
  //             groupmessagedata.push(JSON.parse(data[i]))
  //           }
  //           resolve({ data: groupmessagedata })
  //         }
  //       })
  //   })
  // }

  //////////////////  get mongo group chat //////////////////
  get_group_message(to) {
   // console.log("get group message reached ===========>")
    return new Promise((resolve, reject) => {
     GroupChat.find({to:to}, (err, data)=>{
        if(err){
         reject(err)
        }else{
          ///console.log("mongo group  message data =>", data)
          resolve({ data: data})
        }
      })
    })
  }

  deletecounter(groupId, member){
  //  console.log("reached")
    let db = "groupcounter5".concat(groupId.toString().concat(member))
     client.del(db, (err, data)=>{
     if(err){
      // console.log(err)
     }else{
      // console.log("counter deleted")
     }
   })
  }

  ///-----------------------DELETE -----------------////////////

// delete_message(conversation_id){

//       client.del("message"+conversation_id,(err, data)=>{
//         if(err){
//           console.log(err)
//         }else{
//           console.log("message deleted")

//         }
//       })
//   } /////// method end ////////////////

// delete_conversation_id(){
//   let participates = 'Love,Trivedi'
//   client.del("conversation"+participates,(err, data)=>{
//     if(err){
//       console.log('err')
//     }else{
//       console.log('deleted')
//     }
//   })
// }

// getusers(groupname){
//   return new Promise((resolve, reject)=>{
//   client.lrange(groupname, 0, -1, (err, data) => {
//     if(err){return(err)}
//     else{
//               if(data.length == 0){
//                 console.log(groupname)
//                 console.log("no users")
//                 resolve("no users")
//               }else{
//                 console.log(data)
//                 resolve(data)
//               }
      
//           }
//         }
//   )}
//   )}

/////////////// mongo get group members //////////////////

getusers(groupname){
  return new Promise((resolve, reject)=>{
    let groupId = groupname
    Chatgroup.find({_id:groupId}, (err, data)=>{
      if(err){
      //  console.log(err)
        reject(err)
      }else{
        resolve(data[0].members)
      }
    })
  }
  )}

  // setgroupcounter(groupcounter, groupId, members, author) {
  //   return new Promise((resolve, reject) => {
  //     members.map((member) => {
  //       if (member != author) {
  //         let db = "groupcounter5".concat(groupId.toString().concat(member))
  //         client.lrange(db, -1, -1,
  //           (err, data) => {
  //             if (err) { reject(err) }
  //             else {
  //               let temp
  //               if (data.length > 0) {
  //                 temp = JSON.parse(data[0]).groupcounter + groupcounter
  //               } else {
  //                 temp = groupcounter
  //               }
  //               const payload = {
  //                 groupcounter: temp,
  //                 groupId
  //               }
  //               client.rpush(db, JSON.stringify(payload))
  //               console.log("res data =>", data)
  //               resolve(data)
  //             }
  //           })
  //       }
  //     })
  //   })
  // }

  ////////////////////// mongo setup group counter //////////////////////////////
  setgroupcounter(groupcounter, groupId, members, author) {
    return new Promise((resolve, reject) => {
      members.map((member) => {
        if (member != author) {
          let Id = groupId.toString().concat(member)
          GroupCounter.find({Id:Id}, (err, data)=>{
            if(err){
             // console.log(err)
              reject(err)
            }else{
              if(data.length < 1){
                var groupcounter  = new GroupCounter({
                  Id:Id,
                  groupId:groupId,
                  GroupCounter:1
                })
                groupcounter.save()
              }else{
                let updatedcounter = data[0].GroupCounter + 1
                GroupCounter.findOneAndUpdate({Id:Id}, { $set: { GroupCounter: updatedcounter } },
                  (err, data) => {
                    if (err) {
                     // console.log(err)
                    } else {
                     // console.log("updated counter data =>", data.GroupCounter)
                      resolve(data.GroupCounter)
                    }
                  }
                )
              }
            }
          })
        }
      })
    })
  }

  ////////////////////////// get group counter ////////////
  getgroupcounter(groupId, member) {
    return new Promise((resolve, reject) => {
      let Id = groupId.toString().concat(member)
      GroupCounter.find({ Id: Id }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          if (data.length > 0) {
            resolve(data[0])
          } else {
            //console.log("no counter data")
            resolve({ groupcounter: 0, groupId: '' })
          }
        }
      })
    })
  }
  //////////////////////////  mongo set p2p message conunter //////////////////////

  setusercounter(users, sender, receiver) {
    return new Promise((resolve, reject) => {
      users.map(
        (user, index) => {
          let Id = receiver.concat('@', user)
          if (sender == user) {
            UserCounter.find({ Id: Id }, (err, data) => {
              if (err) {
                reject(err)
              } else {
                //console.log("user counter data =>", data)
                if (data.length < 1) {
                  var usercounter = new UserCounter({
                    Id: Id,
                    UserCounter: 1
                  })
                  usercounter.save()
                } else {
                  let updatedcounter = data[0].UserCounter + 1
                  UserCounter.findOneAndUpdate({Id:Id}, { $set: { UserCounter: updatedcounter } },
                    (err, data) => {
                      if (err) {
                       // console.log(err)
                      } else {
                        //console.log("updated counter data =>", data.UserCounter)
                        resolve(data)
                      }
                    }
                  )
                }
              }
            })
          } else {
            UserCounter.find({ Id: Id }, (err, data) => {
              if (err) {
                reject(err)
              }else{
                if(data.length < 1){
                  var usercounter = new UserCounter({
                    Id: Id,
                    UserCounter: 0
                  })
                  usercounter.save()  
                }
              } })
          }
        })
    })
  }

  getusercounter(users, receiver, sender) {
   // console.log("users =>", users)
   // return new Promise((resolve, reject) => {
      let usercounter = []
      let promise = users.map((user, index) => {
        let Id = sender.concat('@', user)
        return new Promise((resolve) => {
        UserCounter.find({ Id: Id }, (err, data) => {
          if (err) {
            reject(err)
          } else {
          //  console.log("counter  data =>", data[0])
              usercounter.push(data[0])
              resolve(usercounter)
           // console.log('usercounter ======>',usercounter)
          }
        })
      })
    })
    Promise.all(promise).then(res => {
     // console.log(usercounter, '=> usercounter')
      console.log('=> promise.all res counter =>',res)
      //setgroupMessageCounter(res[0])
    })
  }
   
} //////////////////// CLASS END /////////////////////////////////////

