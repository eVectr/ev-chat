import React, { useState, useEffect, Fragment, useRef,  } from 'react'

import { connect } from 'react-redux'
import { Alert } from 'reactstrap'

import io from 'socket.io-client'
import axios from "axios"

import { GroupModal } from '../components/GroupModal'
import Loader from '../components/Loader'
import CreateGroupModal from '../components/CreateGroupModal'
import AddUserModal from '../components/AddUserModal'
import GroupMemberModal from '../components/GroupMemberModal'

import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users'
import Sucess from '../components/FlashMessage'



let socket = null
let activeChatUserGlobal = {}
let activeChatGroupGlobal = {}

const ChatWindow = ({ groups,activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages }) => {

   
    const [message, setMessage] = useState('')
    const [sendStatus, setSendStatus] = useState('')
    const [status, setStatus] = useState('')
    const [members, setMembers] = useState([])
    const [list, setList] = useState([])
    const [maxUser, setMaxUserLimit] = useState(5)

    useEffect(() => {
        scrollToBottom();
    }, [])
 

    useEffect(() => {
        scrollToBottom();
    }, [messages.length])

    
    let user = getUser()
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
            socket.on('messageSent', data =>{
                setSendStatus(data)
            })
        }
    }

    const sendGroupMessage = () => {
      
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
            to: activeChatGroup.groupname    
        }

        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendGroupMessage', messagePayload)
            socket.on('messageSent', data =>{
                setSendStatus(data)
            })
        }
    }


let setMaxUser = (e) => {
        setMaxUserLimit(e.target.value)
        
}

let saveMembers= ()=>{
  
    axios.post(`http://localhost:5000/adduser`, { groupname:activeChatGroup.groupname, users:members, maxuser:maxUser })
    .then(console.log("success"))
     
}


let getMembers = ()=>{
    let groupname =  activeChatGroup.groupname
    axios.post(`http://localhost:5000/getuser`, {groupname:groupname})
    .then(response =>{console.log("active group member==>",response)
        let data = response.data
        console.log(data, 'data')
        setList(data)
})
}


    let deleteMember = (user) => {
    
    let groupname =  activeChatGroup.groupname
    axios.post(`http://localhost:5000/removeuser`, {groupname, user})
    .then(response =>{
        axios.post(`http://localhost:5000/getuser`, {groupname:groupname})
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

    
    return (

       <div className="col-9 chat-window">
       
            {
                isGroup? <Fragment>
            {
                
                activeChatGroup.groupname ? 
                <div class="show-chat" >

                     <div class="message-header">
                        <div>
                            <h2>{activeChatGroup.groupname}</h2>
                            <GroupMemberModal getMembers = {getMembers} list = {list} deleteMember={deleteMember} />
                        </div>
                        <span><GroupModal saveMembers={saveMembers} user ={user.username} handleChange={handleChange} setMaxUser = {setMaxUser}></GroupModal></span>
                        
                    </div>
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
                                            {message.content}
                                        </div>
                                    </div>
                                )
                            )
                        }
                        
                    </div>
                    <div class="input-group message-box">
                        <textarea onChange={e => setMessage(e.target.value)} onKeyPress={handleGroupEnterShiftPress} value={message} class="form-control message-input" placeholder="Write your message..."></textarea>
                        <div class="input-group-append" onClick={sendGroupMessage}>
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
                                        
                                        <pre className="m-0">{message.content}
                                        <div className="date">
                                            <div style = {DateTimeStyle}>
                                                {message.DateTime}
                                                
                                            </div>
                                            <p className='status'>{ user.username == message.author ? 
                                                
                                                <Fragment>
                                                    { sendStatus ? <i class="fa fa-check" aria-hidden="true"></i>: null }
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
                        <div class="input-group-append" onClick={sendMessage}>
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
    const [groupname, setGroupName] = useState()
    const [isGroup, setisGroup] = useState()
    const [filteredgroups, setFilteredGroups] = useState([])
    const [groupMembers, setGroupMember] = useState()
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [activeChatUser, setActiveChatUser] = useState({username : ''})
    const [activeChatGroup, setActiveChatGroup] = useState({groupname : ''})
    const [hide, setHide] = useState(false)
    const [userSelected, setUserSelected] = useState()
    const [groupSelected, setGroupSelected] = useState()
    const [checklogin, setCheckLogin] = useState(true)
    
  


    useEffect(() => {
            socket = io('http://localhost:6547')
          //socket = io('http://209.97.142.219:6547')
             socket.emit('newConnection', user)
        })
 

    useEffect(() => {
         axios.get('http://localhost:5000/Getgroup')
            //axios.get('http://209.97.142.219:5000/Getgroup')
            .then(response => {
                setGroups(response.data)
                console.log("API groups",response.data)
         })
        
    
    },[])
    
    

    
    let user = getUser()

    let groupicon = {
        fontSize:'22px',
        marginRight:'10px'
      }
    

    const activeChatUserName = activeChatUser && activeChatUser.username


    let appendMessages = (data) => {
        if (data.author == activeChatUserGlobal.username || data.author == user.username) {
             setMessages(prevMessages => {
                 const updatedMessages = prevMessages.concat(data)
                 return updatedMessages
             })
        }
     }

     let appendGroupMessages = (data) => {
        if (data.author == activeChatGroupGlobal.groupname || data.author == user.username) {
             setMessages(prevMessages => {
                 const updatedMessages = prevMessages.concat(data)
                 return updatedMessages
             })
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

   
    

let saveGroupName = () => {
    
      axios.post(`http://localhost:5000/Creategroup`, { groupname:groupname, user:user.username })
     // axios.post(`http://209.97.142.219:5000/Creategroup`, { groupname:groupname, admin:user.username })
      .then(res => {
          let users = user.username.concat(' ~ ', 'Admin')
          console.log("Admin ==>", users )
        axios.post(`http://localhost:5000/adduser`, { groupname:groupname, users:[users] })
      //  axios.post(`http://209.97.142.219:5000/adduser`, { groupname:groupname, users:[user.username] })
        axios.get('http://localhost:5000/Getgroup')
        //axios.get('http://209.97.142.219:5000/Getgroup')
        //axios.get('http://209.97.142.219:5000/Deletegroup')
        .then(response => {
         setGroups(response.data)
          console.log("API groups",response.data)
         })
      })
      setHide(false) 
    }




    let handleClose = () => {
       setHide(false)
    }
    
    let handleShow=() => {
        setHide(true)
    }
    
    const setGroupNames = (e) => {
        setGroupName(e.target.value)
        
    }
   

    useEffect(() => {
       if (user && user.username) return
       props.history.push('/')
    },[])
   

    useEffect(() => {
       
        // setLoading(true)
        activeChatUserGlobal = activeChatUser
        socket.on('receivedMessage', appendMessages)
        return () => {
            console.log(`socket.removeListener('receivedMessage', appendMessages)`)
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
            setLoading(false)
        }
     }, [activeChatGroup.groupname])

  
    useEffect(() => {
        
        if (activeChatUser && activeChatUser.username) {
            socket.emit('join', {author:user.username, to: activeChatUser.username })
            socket.on('message', conversation =>{
                const {  data =  {} } = conversation
                setLoading(false)
                setMessages(data)  
           })
        }
    }, [activeChatUser.username])


    useEffect(() => {
        setLoading(false) 
        if (activeChatGroup && activeChatGroup.groupname) {
            socket.emit('groupjoin', {author:user.username, to: activeChatGroup.groupname })
            socket.on('groupmessage', conversation =>{
                console.log("conversation ===>", conversation)
              
                setMessages(conversation) 
                
           })
        }
    }, [activeChatGroup.groupname])



    useEffect(() => {
            setTimeout(function(){ setCheckLogin(false) }, 1000);
    }, [])


    useEffect(() => {
        groups.map((group)=>{
            
            let groupname = group.groupname
            console.log("groupname ========>", groupname)
             axios.post('http://localhost:5000/getuser', {groupname:groupname}).then(res => {
                 console.log("res  ==",res.data[0])
            
                 if(res.data.length){
                     let admin = user.username.concat(' ~ ', 'Admin')
                     let member = user.username
                     console.log("member ->", member)
                    let check = res.data.includes(member) || res.data.includes(admin)
                    console.log("check =>",check)
                     if(check){
                         setFilteredGroups(prev => {
                             let updatedGroups = prev.concat(group)
                             return updatedGroups
                        })
                     }
                 }
             })

     })
},[groups.length])

   

   
    const filteredUser = users.filter(exisitingUser => user.username != exisitingUser.username)
    const activeUserName = activeChatUser && activeChatUser.username || ''
    const activeChatMessages = messages

    let userLogOut = () => {
        localStorage.clear()
        props.history.push('/')
    }



    console.log(" groups ==>",groups)
    console.log("filtered groups ==>",filteredgroups)


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
                <CreateGroupModal setGroupNames={setGroupNames} groupname={groupname} saveGroupName={saveGroupName} handleClose={handleClose} hide={hide} handleShow={handleShow} />
            
              

                <ul className="list-group">
                        {
                            filteredgroups.map(
                                (group, index) =>
                                    
                                    
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
                    </ul>
                
                   
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
                    
                
                </aside>
                    <ChatWindow
                        isGroup ={isGroup}
                        isLoading={isLoading}
                        groups ={groups}
                        messages={activeChatMessages}
                        activeChatUser={activeChatUser}
                        activeChatGroup={activeChatGroup}
                        updateMessages={
                           message => appendMessages( message)
                        }
                      
                    />
            </div>
        </div>
    )

}

export default connect(state => state)(Chat)
