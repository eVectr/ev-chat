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

const ChatWindow = ({ user, sendStatus, activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages, notifyMe }) => {

   
    const [message, setMessage] = useState('')
    const [members, setMembers] = useState([])
    const [list, setList] = useState([])
    //const [maxUser, setMaxUserLimit] = useState([{groupId:'',maxLimit: 5}])
   const [maxUser, setMaxUserLimit] = useState(5)
    const [login, setLogin] = useState(false)
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)
    const [showModal, setshowModal] = useState(false)
    let sendGroupStatus = ''


    useEffect(() => {
        scrollToBottom();
    }, [])
 

    useEffect(() => {
        scrollToBottom();
    }, [messages.length])

    let msg = useRef(null)


    let groupstyle = {
        color:"red"
    }

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
       
        if (!message.trim().length)  return
        

       

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
        // axios.post('http://localhost:5000/getuser', {groupId:activeChatGroupGlobal.groupId})
        //      .then(members =>{
        //          members.data.map(member=>{
        //              console.log(member , '=', data.author)
        //              if(member == data.author){notifyMe()}
        //          })
        //      })
        notifyMe()
      
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
            to: activeChatGroup.groupId
        
        }

        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendGroupMessage', messagePayload)
        
        }
    }

  

let setMaxUser = (e) => {
    console.log("group id =>",activeChatGroupGlobal)
        setMaxUserLimit(e.target.value)
}

let saveMembers= () => {
    axios.post(`http://localhost:6565/adduser`, { groupId:activeChatGroup.groupId, users:members, maxuser:maxUser })
    // axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId:activeChatGroup.groupId, users:members, maxuser:maxUser })
    .then(res => { console.log(res,' = res msg')
        let msg = res.data
        console.log(msg, 'msg')
        if(!msg) {
        setError(true)
        }
        if (msg) {
            setLogin(true)
            setshowModal(false)
            setMembers([])
        }
    })    
    .then(console.log("success"))   
}



useEffect(()=>{
    setTimeout(()=>setShow(false), 5000)
}, [show])

useEffect(()=>{
   setTimeout(()=>setLogin(false), 2000)
}, [login])




let getMembers = ()=>{
    let groupId =  activeChatGroup.groupId
    console.log("group id ->", groupId)
    axios.post(`http://localhost:6565/getuser`, {groupId:groupId})
    //axios.post(`https://reactchat.softuvo.xyz/getuser`, {groupId:groupId})
    .then(response =>{console.log("active group member==>",response)
        let data = response.data
        console.log(data, 'data')
        setList(data)
})
}


    let deleteMember = (user) => {
    let groupId =  activeChatGroup.groupId
    axios.post(`http://localhost:6565/removeuser`, {groupId, user})
    // axios.post(`https://reactchat.softuvo.xyz/removeuser`, {groupId, user})
    .then(response =>{
        axios.post(`http://localhost:6565/getuser`, {groupId:groupId})
      //axios.post(`https://reactchat.softuvo.xyz/getuser`, {groupId:groupId})
        .then(res =>{
            setList(res.data)
        
        })
    })
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

   

    return (
       <div className="col-9 chat-window">
       
            {
                isGroup? <Fragment>
            {
                
                activeChatGroup.groupId ? 
                <div class="show-chat" >

                    <div class="message-header">
                        <div>
                            <h2>{activeChatGroup.groupname}</h2>
                            <GroupMemberModal getMembers = {getMembers} admin ={user.username} list = {list} deleteMember={deleteMember} members={members}/>
                        </div>
                       <span><GroupModal  maxUser = {maxUser} showModal={showModal}  showGroupModal={showGroupModal} saveMembers={saveMembers} admin={activeChatGroup.admin} user ={user.username} list={list}  handleChange={handleChange} setMaxUser = {setMaxUser} getMembers = {getMembers} error ={error} show={show} msg={msg} members={members} ></GroupModal></span>
                    </div>
                    {login ? <SucessfullMessage/> : null} 
                    <div className="message-list" ref={(el) => { msg = el; }} >
                        {isLoading ? <Loader /> : null }
                        
                        {
                            messages.map(
                                (message, index) => (
                                    <div key={index}  id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                        <div class="alert alert-light message-bubble" >
                                             <div style ={groupstyle}>
                                          {message.author}
                                            </div> 
                                           
                                            <pre className="m-0 messages"> {message.content}
                                            <div className="date">
                                            <div style = {DateTimeStyle}>
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
                                )
                            )
                        }
                        {/* {login ? <SucessfullMessage/> : null}  */}
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
   
   
    let user = getUser()
    console.log(user, 'getUser')

    useEffect(() => {
            socket = io('http://localhost:6565')
           // socket = io('https://reactchat.softuvo.xyz')
             socket.emit('newConnection', user)
             socket.on('seen', data =>{
                setSendStatus(data)
            })

        },[])
    

    useEffect(() => {
           axios.get('http://localhost:6565/Getgroup')
          // axios.get('https://reactchat.softuvo.xyz/Getgroup')
            .then(response => {
                setGroups(response.data)
                console.log("API group",response.data)
         })
        
    
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
            console.log("NEW NOTIFICATION")
            var notification = new Notification('p2p', {
            body: 'New Message'
          })
        }
      }


    let groupicon = {
        fontSize:'22px',
        marginRight:'10px'
      }
    

      let check = (data)=>{
        console.log("check fun data =>",data)
        setMessages([data])
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
        if (data.to == activeChatGroupGlobal.groupId || data.author == user.username) {
             setMessages(prevGroupMessages => {
                 const updatedMessages = prevGroupMessages.concat(data)
                 return updatedMessages
             })
        }
        else{
            console.log("error")
        }
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
        console.log("group id ======>", groupId)
        axios.post(`http://localhost:6565/Creategroup`, { groupname, groupId, admin:user.username  })
       //  axios.post(`https://reactchat.softuvo.xyz/Creategroup`, { groupname, groupId, admin:user.username })
          .then(res => {
              let users = user.username
            axios.post(`http://localhost:6565/adduser`, { groupId:groupId, users:[users] })
           // axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId:groupId, users:[user.username] })
            axios.get('http://localhost:6565/Getgroup')
           //  axios.get('https://reactchat.softuvo.xyz/Getgroup')
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
        socket.on('receivedMessage', appendMessages)
        return () => {
            socket.removeListener('receivedMessage', appendMessages)
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


    useEffect(() => {
       
        if (activeChatGroup && activeChatGroup.groupId) {
            socket.emit('groupjoin', {author:user.username, to: activeChatGroup.groupId })
            socket.on('groupmessage', conversation =>{
                console.log("conversation ===>", conversation)
                const {  data =  {} } = conversation
                setLoading(false) 
                setMessages(data) 
            })
        }
    }, [activeChatGroup.groupId])


    useEffect(() => {
        setTimeout(function(){ setCheckLogin(false) }, 1000);
    }, [])


    useEffect(() => {
        const promiseArr = groups.map((group)=>{
            let groupId = group.groupId
             return axios.post('http://localhost:6565/getuser', {groupId:groupId})
            // return axios.post('https://reactchat.softuvo.xyz/getuser', {groupId:groupId})
           
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

                setFilteredGroups(validGroups)
            })
},[groups.length])

   
    const filteredUser = users.filter(exisitingUser => user.username != exisitingUser.username)
    const activeUserName = activeChatUser && activeChatUser.username || ''
    const activeChatMessages = messages
   

    let userLogOut = () => {
        user = ''
        localStorage.clear()
        props.history.push('/')
    }
   

    console.log("Messagessss =>", messages)
    console.log("activeChatMessages =>", activeChatMessages)
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
                                      <i class="fas fa-users" style ={groupicon} ></i>
                                        <span className="username">{group.groupname}</span> 
                                    
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
                      
                    />
            </div>
        </div>
    )

}

export default connect(state => state)(Chat)
