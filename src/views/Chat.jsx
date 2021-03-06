import React, { useState, useEffect, Fragment, useRef,  } from 'react'

import { connect } from 'react-redux'
import { Alert } from 'reactstrap'

import io from 'socket.io-client'
import axios from "axios"

import { GroupModal } from '../components/GroupModal'
import Loader from '../components/Loader'
import CreateGroupModal from '../components/CreateGroupModal'

import GroupMemberModal from '../components/GroupMemberModal'

import { getUser, removeUser } from '../utils/auth'
import users from '../constants/users'


import SucessfullMessage from '../components/SucessfullMessage'



let socket = null
let activeChatUserGlobal = {}
let activeChatGroupGlobal = {}

const ChatWindow = ({ user, sendStatus,activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages, 
    setGroups, messageCounter, setCounterCheck }) => {

   
    const [message, setMessage] = useState('')
    const [members, setMembers] = useState([])
    const [list, setList] = useState([])
    const [maxUser, setMaxUserLimit] = useState('')
    const [userLimit, setuserLimit] = useState('')
    const [login, setLogin] = useState(false)
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)
    const [showModal, setshowModal] = useState(false)
    let [limit_disable, set_limit_disable] = useState(true)
    let sendGroupStatus = ''
    let [editUser, setEditUser] = useState(false)
    
  


    useEffect(() => {
        scrollToBottom();
    }, [])
 

    useEffect(() => {
        scrollToBottom();
    }, [messages.length])

    useEffect(() => {
        scrollToBottom();
    }, [messages.notice])
    
    //let user = getUser()
    let msg = useRef(null)


    // let groupstyle = {
    //     color:"red"
    // }

    let DateTimeStyle = {
        color:"green",
        fontSize:'.7rem',
    }


   let  handleEnterShiftPress = (e) => {
       if (e.key === 'Enter' && e.shiftKey) {
        } else if (e.key === 'Enter') {
            sendMessage()
            e.preventDefault();
         }
          else { 
         } 
    }

    let  handleGroupEnterShiftPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
         } else if (e.key === 'Enter') {
             sendGroupMessage()
             e.preventDefault();
          }
           else { 
             
          } 
     }

   
    const scrollToBottom = () => {
        document.getElementById('last-msg') && document.getElementById('last-msg').scrollIntoView();
    }

    const sendMessage = () => {

        if (!message.trim().length) return

        var today = new Date()
        var hour = today.getHours();         
        var minute = today.getMinutes();
        var date = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear()
        
        let time1 = hour.toString().concat(':',+minute.toString())
        let date1 = date.toString().concat('/',month.toString().concat('/',+year.toString()))
        let DateTime = date1.toString().concat(' ', time1.toString())
     
        
        const messagePayload = {
            DateTime:DateTime,
            author: user.username,
            content: message,
            to: activeChatUser.username
            
        }

        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendMessage', messagePayload)   
        }
    }

    const sendGroupMessage = () => {
        // setMessageCounter(prev => {
        //     const updatedcounter = parseInt(prev) + 1
        //     return updatedcounter
        // })
      
        if (!message.trim().length) return
        var today = new Date()
        var hour = today.getHours();         
        var minute = today.getMinutes();
        var date = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear()
        
        let time1 = hour.toString().concat(':',+minute.toString())
        let date1 = date.toString().concat('/',month.toString().concat('/',+year.toString()))
        let DateTime = date1.toString().concat(' ', time1.toString())
     
        const messagePayload = {
            DateTime:DateTime,
            author: user.username,
            content: message,
            to: activeChatGroup.groupId,
            counter: messageCounter
        
        }

        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendGroupMessage', messagePayload)
        
        }
    }

  

let setMaxUser = (e) => {
    
    let groupId = activeChatGroupGlobal.groupId
    let maxLimit = e.target.value
    console.log("group id =>",groupId)
    console.log("maxlimit =>", maxLimit)
    let data = [{groupId:groupId, maxLimit:maxLimit}]
    //setMaxUserLimit([data])


    setMaxUserLimit(maxUser => ({
        ...maxUser, data
    }))
        
   
}

let saveMembers= () => {
     axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId:activeChatGroup.groupId, users:members, maxuser:maxUser })
     .then(res => { console.log(res,' = res msg')
        socket.emit('add_member', members)
        let msg = res.data
        if(!msg) {
            setError(true)
        }
        if (msg) {
            setLogin(true)
            setshowModal(false)
            setMembers([])
        }
       /////////////////////////
        if(msg){
        let note = user.username+"  "+'Added'+"  "+  members 
        axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to:activeChatGroup.groupId, note:note})
        .then(save_res =>{
           axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to:activeChatGroup.groupId})
           .then(get_res =>{
             //  setGroupNote(JSON.parse(get_res.data[0]))
                setMessage(JSON.parse(get_res.data[0]))
               setMessage(note)

               const messagePayload = {
                   DateTime:'',
                   author: user.username,
                   content: '',
                   to: activeChatGroup.groupId,
                   notice: note
               }
       
               updateMessages(messagePayload)
               setMessage('')
               //setGroupNote('')
               socket.emit('sendGroupMessage', messagePayload) 
                
        })
    })
   } /////// end if 
 })       
}



useEffect(()=>{
    setTimeout(()=>setShow(false), 5000)
}, [show])

useEffect(()=>{
   setTimeout(()=>setLogin(false), 2000)
}, [login])




let getMembers = ()=>{
    let groupId =  activeChatGroup.groupId
    axios.post(`https://reactchat.softuvo.xyz/getuser`, {groupId:groupId})
    .then(response =>{console.log("active group member==>",response)
        let data = response.data
        console.log(data, 'data')
        setList(data)
}) //////////////////////// LIMIT
axios.post(`https://reactchat.softuvo.xyz/getgrouplimit`, {groupId:groupId})
   .then(res => {
       setMaxUserLimit(res.data.grouplimit)
   })
}


let deleteMember = (user) => {
        let groupId =  activeChatGroup.groupId
        axios.post(`https://reactchat.softuvo.xyz/removeuser`, {groupId, user})
        .then(response =>{
         socket.emit('remove_member', user)
         axios.post(`https://reactchat.softuvo.xyz/getuser`, {groupId:groupId})
         .then(res =>{
             setList(res.data)
         })
        })
///////////////////////////////////////////////////////////
        let note = activeChatGroup.admin+" "+ "Removed"+ " "+ user
        axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to:activeChatGroup.groupId, note:note})
        .then(save_res =>{
            axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to:activeChatGroup.groupId})
            .then(get_res =>{
               // setGroupNote(JSON.parse(get_res.data[0]))
                setMessage(note)
            const messagePayload = {
                DateTime:'',
                author: user.username,
                content: '',
                to: activeChatGroup.groupId,
                notice: note
            }
    
            updateMessages(messagePayload)
            setMessage('')
          //  setGroupNote('')
    
            if (socket) {
               // setIsGroupNotice(true)
                socket.emit('sendGroupMessage', messagePayload)
            }

        })
    })
///////////////////////////////////////////////////////////
}


let leftgroup = (user) =>{
    return new Promise((resolve, reject)=>{
        ////////////////
      let note = user+"  "+'Left'+"  "+ "Group"
      axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to:activeChatGroup.groupId, note:note})
      .then(save_res =>{
          axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to:activeChatGroup.groupId})
          .then(get_res =>{
             // setGroupNote(JSON.parse(get_res.data[0]))
              setMessage(note)
              const messagePayload = {
                  DateTime:'',
                  author: '',
                  content: '',
                  to: activeChatGroup.groupId,
                  notice: note
              }
              updateMessages(messagePayload)
              setMessage('')
             // setGroupNote('')
      
              if (socket) {
                 //setIsGroupNotice(true)
                 resolve(socket.emit('sendGroupMessage', messagePayload))
              }
  
          })
      })
      ///////////////

    })
}

let exitGroup = (user) =>{
      
    let groupId =  activeChatGroup.groupId
    axios.post(`https://reactchat.softuvo.xyz/removeuser`, {groupId, user})
    .then(response =>{
      axios.post(`https://reactchat.softuvo.xyz/getuser`, {groupId:groupId})
        .then(res =>{
            setList(res.data) 
            
        })
    })
    
   leftgroup(user).then(res =>{
    window.location.reload()
   }) 
}


let deleteGroup = () =>{
    let groupname =  activeChatGroup.groupname
    let groupId =  activeChatGroup.groupId
    let admin =  activeChatGroup.admin
    let groupcounter = activeChatGroup.groupcounter
    axios.post(`https://reactchat.softuvo.xyz/getuser`,{groupId:groupId})
    .then(member =>{
              
                socket.emit('delete_group', member.data) 
            })
    axios.post(`https://reactchat.softuvo.xyz/removegroup`, {groupname, groupId, admin, groupcounter})
    .then(response =>{
        axios.get(`https://reactchat.softuvo.xyz/Getgroup`,)
        .then(res =>{
            setGroups(res.data)
           
        })
    })
    window.location.reload() 
}


    let handleChange = data => {
        let array =[]
        data.map((member)=>{
            array.push(member.value)
        })
        setMembers(array)
        
    }


    let showGroupModal = (isModal) =>{
        setshowModal(isModal)
        setError(false)
    }

    let changeUserLimit = (e) => {
        
        if (e.target.value.length){
            set_limit_disable(false)
        }else{
            set_limit_disable(true)
        }
        console.log("e.targete.",e.target.value)
        console.log("limit_diszable =>", limit_disable)
        setuserLimit(e.target.value)
    }

    let saveUserLimit = (editUser) => {
        axios.post(`https://reactchat.softuvo.xyz/editlimit`, {grouplimit:userLimit, groupId: activeChatGroup.groupId})
        .then(res =>{
                setMaxUserLimit(res.data.grouplimit)
        })

        setMaxUserLimit ('')
        setEditUser(editUser)
        
 
    }
  
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

  
    
    return (
        <div className="col-9 chat-window">
        
             {
                 isGroup? <Fragment>
             {
     
                 
                 activeChatGroup.groupId ? 
                 <div class="show-chat" >
 
                     <div class="message-header">
                         <div>
                             <h2>{(activeChatGroup.groupname).capitalize()}</h2>
                             <GroupMemberModal deleteGroup={deleteGroup} exitGroup = {exitGroup} getMembers = {getMembers} user ={user.username} admin ={activeChatGroup.admin} list = {list} deleteMember={deleteMember} members={members}/>
                         </div>
                         <span><GroupModal  maxUser = {maxUser} 
                        editUser={editUser}
                        changeUserLimit = {changeUserLimit}
                        saveUserLimit = {saveUserLimit}
                        setEditUser={setEditUser}
                        showModal={showModal} 
                         showGroupModal={showGroupModal} 
                         saveMembers={saveMembers} admin={activeChatGroup.admin} 
                         user ={user.username} list={list}  handleChange={handleChange} 
                         setMaxUser = {setMaxUser} 
                         limit_disable = {limit_disable}
                         getMembers = {getMembers} error ={error} show={show} msg={msg} members={members} ></GroupModal></span>
                     </div>
                     {login ? <SucessfullMessage/> : null} 
                     <div className="message-list" ref={(el) => { msg = el; }} >
                         {isLoading ? <Loader /> : null }
                         
                         
                         {
                            messages.map(
                                (message, index) => (
                                    <Fragment>
                                        {
                                            // (index == messages.length-1 && user.username != message.author)?
                                            // setCounterCheck(true):'' 
                                            
                                           
                                        }

                                        {message.content? 
                                        <div key={index}  id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                            <div class="alert alert-light message-bubble" >
    
                                                {user.username == message.author ?
                                                <div className='group-user'>
                                                {message.author}
                                                </div> :
                                                <div className='group-user2'>
                                                {message.author}
                                                </div>
                                                }
                                            
                                            <pre className="m-0 messages"> {message.content}
                                                <div className="date">
                                                <div className = 'msg-date-time'>
                                                    {message.DateTime}
                                                    </div>
                                                    <p className='status'>{ user.username == message.author ? 
    
                                                    <Fragment>{(index == messages.length || index == messages.length -1)?
                                                        <Fragment>
                                                            { (sendGroupStatus == 'sent' || sendGroupStatus == '' )? <i class="fa fa-check" aria-hidden="true"></i>: '' }
                                                      </Fragment>
                                                            :''}
                                                    </Fragment>
                                                  
                                                    
                                                     :null }</p>
                                                    
                                               
                                                </div></pre>
                                            
                                         </div>
                                      
                                     </div>
                                     :
                                     <div key={index}  id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container notification-center`}>
                                     <div class="alert alert-light message-bubble" >
                                     <div className='user-add-msg-notification'>{message.notice}</div>
                                     </div>
                                     </div>
                                     
                                     }
                                    
                                     </Fragment>
                                 )
                             )
                            
                         }
                        
                         {/* {activeChatGroup.groupId == groupNote.to?
                          <div className='group-msg-notification'>{groupNote.note}</div>:
                          ''
                         } */}
                       
                     </div>
                          
                     <div class="input-group message-box">
                         <textarea onChange={e => setMessage(e.target.value)} onKeyPress={handleGroupEnterShiftPress} value={message} class="form-control message-input" placeholder="Write your message..."></textarea>
                         <div class="input-group-append" onClick={isGroup? sendGroupMessage : ''}>
                             <span class="input-group-text send-icon-container">
                                 <i class="fas fa-paper-plane"></i>
                             </span>
                         </div>
                     </div>
                 </div>
                : null
             }
 
             </Fragment>:
                 <Fragment>
 
             {
                 activeChatUser.username ? 
                 <div class="show-chat">
                      <div class="message-header">
                         <h2>{activeChatUser.username}</h2>
                     </div>
                     <div className="message-list" ref={(el) => { msg = el; }} >
                     {isLoading ? <Loader /> : null }
                          {
                             messages.map(
                                 (message, index) => (
                                  
                                     <div key={index}  id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                         <div class="alert alert-light message-bubble" >
                                         
                                         <pre className="m-0 messages">{message.content}
                                         <div className="date">
                                             <div style = {DateTimeStyle}>
                                                 {message.DateTime}
                                                 
                                             </div>
                                             <p className='status'>{ user.username == message.author ? 
                                                 
                                                <Fragment>{(index == messages.length || index == messages.length -1)?
                                                     <Fragment>
                                                         { (sendStatus == 'sent' || sendStatus == '')? <i class="fa fa-check" aria-hidden="true"></i>: <i class="fas fa-check-double"></i> }
                                                   </Fragment>
                                                         :''}
                                                 </Fragment>
                                                 
                                                  :null }</p>
                                            
                                         </div>
                                         </pre>    
                                         </div>                                        
                                  </div>       
                                  )
                 ) 
             } 
                        
                         
 
                     </div>
                     <div class="input-group message-box">
                         <textarea onChange={e => setMessage(e.target.value)} onKeyPress={handleEnterShiftPress} value={message} class="form-control message-input" placeholder="Write your message..."></textarea>
                         <div class="input-group-append" onClick={isGroup? '': sendMessage}>
                             <span class="input-group-text send-icon-container">
                                 <i class="fas fa-paper-plane"></i>
                             </span>
                         </div>
                     </div>
                 </div> : null
             }
                 </Fragment>
             }
         </div>
        
    )
 }


const Chat = (props ) => {


    const [groups, setGroups] = useState([])
    const [filteredgroups, setFilteredGroups] = useState([])
    const [groupname, setGroupName] = useState()
    const [isGroup, setisGroup] = useState()
    const [messages, setMessages] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [activeChatUser, setActiveChatUser] = useState({username : ''})
    const [activeChatGroup, setActiveChatGroup] = useState({groupname : ''})
    const [hide, setHide] = useState(false)
    const [userSelected, setUserSelected] = useState()
    const [groupSelected, setGroupSelected] = useState()
    const [checklogin, setCheckLogin] = useState(true)
    const [sendStatus, setSendStatus] = useState('')
    const [load, setLoad] = useState(false)
    const [groupNote, setGroupNote] = useState('')
    let [messageCounter, setMessageCounter] = useState(0)
    let [counterCheck, setCounterCheck] = useState(true)
    let [counterGroup, setCounterGroup] = useState('')
   
   
    let user = getUser()
    console.log(user, 'getUser')

    useEffect(() => {
            //socket = io('http://localhost:6565')
            socket = io('https://reactchat.softuvo.xyz')
             socket.emit('newConnection', user)
             socket.on('seen', data =>{
                setSendStatus(data)
            })
            socket.on('get_add_members', test=>{
               window.location.reload()
            })
            socket.on('get_remove_members', test=>{
                window.location.reload()
             })
             socket.on('get_delete_group', test=>{
                window.location.reload()
             })
            //  socket.on('delete_counter', data=>{
            //      console.log(" counter deleted ", data)
            //    // axios.post('https://reactchat.softuvo.xyz/deletegroupcounter', {groupId:data})
            //  })
           
        },[])
    

    useEffect(() => {
          
           axios.get('https://reactchat.softuvo.xyz/Getgroup')
            .then(response => {
                socket.on('get_counter', get_counter =>{
                    console.log("get_counter new counter==>", get_counter)
                    console.log("API group",response.data)
                    response.data.map((group, index)=>{
                        if(get_counter.groupId == group.groupId){
                           
                            axios.post('https://reactchat.softuvo.xyz/updategroup', {index:index, admin : group.admin, groupId : group.groupId,
                            groupcounter : group.groupcounter,
                            groupname : group.groupname,
                            newgroupcounter: get_counter.groupcounter})
                            .then(res =>{
                                console.log("updated group response =>",res.data)
                                setGroups(res.data)
                            })

                           
                        }else{
                           
                        }
                    })
                  //  setGroups(array)
                 })
                 console.log("API group",response.data)
                setGroups(response.data)
              
         })
        
        // axios.get('https://reactchat.softuvo.xyz/Deletegroup')
    },[])


    document.addEventListener('DOMContentLoaded', function () {
        if (!Notification) {
          alert('Desktop notifications not available in your browser. Try Chrome.'); 
          return;
        }
      
        if (Notification.permission !== 'granted')
        
          Notification.requestPermission();
      })
      
      function notifyMe() {
        if (Notification.permission !== 'granted')
          Notification.requestPermission();
        else {
            var notification = new Notification('p2p', {
            body: 'New Message'
          })
          notification.onclick = function () {
            window.open('https://reactchat.softuvo.xyz');
          }
      
      
        }
      }


    let groupicon = {
        fontSize:'22px',
        marginRight:'10px'
      }
    




    let appendMessages = (data) => {
        console.log("append messages =>", data)
         let check = (user.username == data.to)
            if(check){
                notifyMe()
        }
        console.log(data.author, "==", activeChatUserGlobal.username, data.author, "==", user.username )
        if (data.author == activeChatUserGlobal.username || data.author == user.username ) {
             setMessages(prevMessages => {
                 const updatedMessages = prevMessages.concat(data)
                 return updatedMessages
             })
        }
    }

   

     let appendGroupMessages = (data) => {
       
         //setCounterCheck(true)
         setCounterGroup(data.to)
       
        if (data.to == activeChatGroupGlobal.groupId || data.author == user.username) {
             setMessages(prevGroupMessages => {
                 const updatedMessages = prevGroupMessages.concat(data)
                 return updatedMessages
             })
        }
        axios.post('https://reactchat.softuvo.xyz/getuser', {groupId:data.to})
        .then(members =>{
            let counter_data = {
                groupcounter: 1,
                groupId:data.to,
                members: members
               }

               socket.emit('set_counter', counter_data)
              
           let array = members.data
           for (let i = 0; i < array.length; i++) {
               if ( array[i] != data.author)  {
                   notifyMe()
                 break
               }else{
                   continue
               } 
             }
        })
     }

     let handleChatMouseUp = () =>{
         setisGroup(false) 
         setUserSelected(true)
         setGroupSelected(false)
        
     }

     let handleGroupChatMouseUp = () =>{
        setisGroup(true) 
        setUserSelected(false)
        setGroupSelected(true)
    
    }

let groupparameters = () =>{
    return new Promise((resolve, reject)=>{
        var today = new Date()
        var second = today.getSeconds()
        let groupId = (second+1) * (Math.floor(Math.random() * 100000000000000000) + Math.floor(Math.random() * 100000000000000000))
        resolve(groupId)
    })
}
   
    

let saveGroupName = () => {
    setLoad(true)
    groupparameters().then(groupId =>{
      
         axios.post(`https://reactchat.softuvo.xyz/Creategroup`, { groupname, groupId, admin:user.username , groupcounter: 0 })
         axios.post(`https://reactchat.softuvo.xyz/grouplimit`, {grouplimit:5, groupId:groupId })
          .then(res => {
              let users = user.username
            axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId:groupId, users:[user.username] })
             axios.get('https://reactchat.softuvo.xyz/Getgroup')
            .then(response => {
                let active = {
                    groupname, 
                    groupId,
                    admin:user.username
                }
                setGroups(response.data)
                console.log("API groups",response.data)
                setLoad(false)
                setisGroup(true) 
                setUserSelected(false)
                setGroupSelected(true)
                setActiveChatGroup(active)
            })
          })
          setHide(false) 
          setGroupName('')
    })     
}


    let handleClose = () => {
            setHide(false)
    }
    
    let handleShow=() => {
        setHide(true)
    }
    
    
    const setGroupNames = e => setGroupName(e.target.value)


    useEffect(() => {
       if (user && user.username) return
       props.history.push('/')
    },[])
   

    useEffect(() => {
        setLoading(true)
        activeChatUserGlobal = activeChatUser
        const func = (data) => {
            console.log('recieved', data)
            appendMessages(data)
        }
        socket.on('receivedMessage', func)
        return () => {
            socket.removeListener('receivedMessage', func)
            setLoading(false)
        }
     }, [activeChatUser.username])


     useEffect(() => {
        setLoading(true)
        activeChatGroupGlobal = activeChatGroup
        socket.on('receivedGroupMessage', appendGroupMessages)
    
        return () => {
            socket.removeListener('receivedGroupMessage', appendGroupMessages)
            setLoading(true)
        }
     }, [activeChatGroup.groupId])

  
    useEffect(() => {
        if (activeChatUser && activeChatUser.username) {
            socket.emit('join', {author:user.username, to: activeChatUser.username })
            socket.on('message', conversation =>{
                const {  data =  {} } = conversation
                console.log("saved conversation =>", data)
                setLoading(false)
                setMessages(data)  
           })
        }
    }, [activeChatUser.username])


    let delete_counter_data ={
        groupId : activeChatGroup.groupId,
        member : user.username
    }
    useEffect(() => {
       
        if (activeChatGroup && activeChatGroup.groupId) {
            socket.emit('groupjoin', {author:user.username, to: activeChatGroup.groupId })
            socket.emit('delete_counter', delete_counter_data)
            socket.on('groupmessage', conversation =>{
                console.log("conversation ===>", conversation)
                const {  data =  {} } = conversation
                setLoading(false) 
                setMessages(data) 
            })
        }
    }, [activeChatGroup.groupId])




    useEffect(() => {
       // console.log("groups groups groups -===>",groups)
        const promiseArr = groups.map((group)=>{
            let groupId = group.groupId
            // return axios.post('http://localhost:6565/getuser', {groupId:groupId})
             return axios.post('https://reactchat.softuvo.xyz/getuser', {groupId:groupId})
           
        })
        
        Promise.all(promiseArr)
            .then(values => {
                const validGroups = groups.filter(
                    (_, index) => {
                        if(values[index].data.length){
                            
                            let member = user.username
                            return values[index].data.includes(member)
                        }
                    }
                )
               // console.log(validGroups, 'validGroups')
                setFilteredGroups(validGroups)
            })
},[groups])

   
    const filteredUser = users.filter(exisitingUser => user.username != exisitingUser.username)
    const activeUserName = activeChatUser && activeChatUser.username || ''
    const activeChatMessages = messages


  
   

    let userLogOut = () => {
        window.location.reload()
        user = ''
        localStorage.clear()
        props.history.push('/')
    }

    useEffect(() => {
        setTimeout(function(){ setCheckLogin(false) }, 1000)

    }, [])
   
  
    useEffect(() => {
        setTimeout(function(){ setCheckLogin(false) }, 1000)
        socket.on('get_counter', get_counter =>{
            console.log("get_counter new counter==>", get_counter)
            setMessageCounter(get_counter.groupcounter)
         })
    
    }, [])

    console.log("groupssssssssssss =======>", groups)
    console.log("filtered groupssssss =======>", filteredgroups)
    
    return (
        
        <div className="chat-container full-height container-fluid"  >
            { props.auth.loginSucess && checklogin ? <Alert color="primary login-msg">{props.auth.loginSucess}</Alert> : null }
            <modal></modal>
            <div className="row full-height">
           
                <aside className="users-list col-3">
                    <div className="user-logout">
                        <span>{user.username}</span>
                        <button onClick={userLogOut}><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                <CreateGroupModal setGroupNames={setGroupNames} groupname={groupname} saveGroupName={saveGroupName} handleClose={handleClose} hide={hide} handleShow={handleShow} load={load}   />
            
                <div className="aside-item">
                
                {load ? <Loader/> : null}

                {
                    console.log(filteredgroups, 'FILTEREDGROUP')
                }
                
                { <ul className="list-group">
                    
                        {
                            filteredgroups.map(
                                (group, index) => {
                                    let { groupcounter = 0 } = group
                        
                                    return (
                                        <li className= 'list-group-item user'
                                        key={index}
                                        onMouseUp={handleGroupChatMouseUp}
                                        onClick={() => {
                                            setActiveChatGroup(group)
                                            setActiveChatUser({})
                                        }}
                                        
                                        className={`list-group-item user ${(activeChatGroup && activeChatGroup.groupId == group.groupId) && groupSelected ? 'selected' : ''}`}
                                    >
                                    <div className='group-list'>
                                        <div>
                                            <i class="fas fa-users" style ={groupicon} ></i>
                                            <span className="username">{group.groupname}</span> 
                                           {counterCheck && groupcounter >0?
                                            <span className='msg-counter'>{groupcounter}</span>
                                            :''
                                        }
                                        </div>
                                    </div>
                                    </li> 
                                    )
                                }
                                   
                            )
                        }
                    </ul> }

                    
                
                   
                    <ul className="list-group">
                        {
                            filteredUser.map(
                                (user, index) =>
                               
                                    <li
                                        key={index}
                                        onMouseUp={handleChatMouseUp}
                                        onClick={() => {
                                            setActiveChatUser(user)
                                            setActiveChatGroup({})
                                        }}
                                        className={`list-group-item user ${
                                        (activeChatUser && activeChatUser.username == user.username) && userSelected ? 'selected' : ''

                                        }`}
                                    >
                                        <i class="fas fa-user-circle user-profile-photo"></i>
                                        <span className="username">{user.username}</span>
                                        
                                    </li>  
                                   
                            )
                        }
                    </ul>
                    
                    </div>
                </aside>
                    <ChatWindow
                        user = {user}
                        isGroup ={isGroup}
                        isLoading={isLoading}
                        groups ={groups}
                        messages={activeChatMessages}
                        activeChatUser={activeChatUser}
                        activeChatGroup={activeChatGroup}
                        sendStatus = {sendStatus}
                        updateMessages={
                           message => appendMessages( message)
                        }
                        updateGroupMessages={
                            message => appendGroupMessages( message)
                         }
                         notifyMe = {notifyMe}
                         groupNote = {groupNote}
                         setGroupNote = {setGroupNote}
                         messageCounter = {messageCounter}
                         setMessageCounter = {setMessageCounter}
                   
                         setCounterCheck = {setCounterCheck}
                      
                    />
            </div>
        </div>
    )

}

export default connect(state => state)(Chat)
