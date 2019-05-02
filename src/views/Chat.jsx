import React, { useState, useEffect, Fragment, useRef } from 'react'

import io from 'socket.io-client'
import axios from "axios"

import { GroupModal } from '../components/GroupModal'
import Loader from '../components/Loader'
import CreateGroupModal from '../components/CreateGroupModal'
import AddUserModal from '../components/AddUserModal'

import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users'



let socket = null
let activeChatUserGlobal = {}

const ChatWindow = ({ groups,activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages }) => {

    console.log("isGroup ==>",isGroup)
    const [message, setMessage] = useState('')

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
   
    const scrollToBottom = () => {
        document.getElementById('last-msg') && document.getElementById('last-msg').scrollIntoView();
    }

    const sendMessage = () => {
        console.log(activeChatUser.username)
        const messagePayload = {
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

    const [show, setShow] = useState(false)
    
    // addGroupMember = () => {
    //     setShow(true)
    // }

    return (

       <div className="col-9 chat-window">
            {
                isGroup? <Fragment>
            {
                
                activeChatGroup.groupname ? 
                <div class="show-chat" >
                     <div class="message-header">
                        <h2>{activeChatGroup.groupname}</h2><span><GroupModal></GroupModal></span>
                        
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
                        <textarea onChange={e => setMessage(e.target.value)} value={message} class="form-control message-input" placeholder="Write your message..."></textarea>
                      
                            <span class="input-group-text send-icon-container">
                                <i class="fas fa-paper-plane"></i>
                            </span>
                        </div>
                    </div>
               : null
            }

            </Fragment>:
                <Fragment>

            {
                activeChatUser.username ? 
                <div class="show-chat" >
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
                                        
                                            {message.content}
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <div class="input-group message-box">
                        <textarea onChange={e => setMessage(e.target.value)} value={message} class="form-control message-input" placeholder="Write your message..."></textarea>
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

const Chat = ({ history }) => {

    const [groups, setGroups] = useState([])
    const [isGroup, setisGroup] = useState()
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [activeChatUser, setActiveChatUser] = useState({username : ''})
    const [activeChatGroup, setActiveChatGroup] = useState({groupname : ''})
    const [hide, setHide] = useState(true)

    useEffect(() => {
        socket = io('http://localhost:6547')
       // socket = io('http://209.97.142.219:6547')
             socket.emit('newConnection', user)
        })
 

    useEffect(() => {
        axios.get('http://localhost:4000/Getgroup')
        .then(response => {
         setGroups(response.data)
         console.log("API Dta",response)
          console.log("API groups",response.data)
         })
    },[])
    
    
    let user = getUser()

    let groupicon ={
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

    
    // const setGroupName = (e) => {
    //     setGroups([e.target.value])
        
    // }
    


    useEffect(() => {
       if (user && user.username) return
       history.push('/')
    },[])
       
    

   
   
    useEffect(() => {
        setLoading(true)


        activeChatUserGlobal = activeChatUser

        socket.on('receivedMessage', appendMessages)

        return () => {
            console.log(`socket.removeListener('receivedMessage', appendMessages)`)
            socket.removeListener('receivedMessage', appendMessages)
        }
     }, [activeChatUser.username])
  


    useEffect(() => {

        if (activeChatUser) {
            socket.emit('join', {author:user.username, to: activeChatUser.username })

            socket.on('message', conversation =>{
                const {  data =  {} } = conversation
                setLoading(false)
                console.log("data =>", data)
                setMessages(data)
                
           })
         
        }
    }, [activeChatUser.username])

   
    const filteredUser = users.filter(exisitingUser => user.username != exisitingUser.username)
    const activeUserName = activeChatUser && activeChatUser.username || ''
    const activeChatMessages = messages

   
    
    return (
        
        <div className="chat-container full-height container-fluid">
        <modal></modal>
            <div className="row full-height">
                
                <aside className="users-list col-3">
                <CreateGroupModal/>
                
              
            
                <ul className="list-group">
                        {
                            groups.map(
                                (group, index) =>
                               
                                    <li className= 'list-group-item user'
                                        key={index}
                                        onMouseUp={()=> setisGroup(true) }
                                        onClick={() => setActiveChatGroup(group)}
                                        className={`list-group-item user ${activeChatGroup && activeChatGroup.groupname == group.groupname ? 'selected' : ''}`}
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
                                        onMouseUp={()=> setisGroup(false) }
                                        onClick={() => setActiveChatUser(user)}
                                        className={`list-group-item user ${activeChatUser && activeChatUser.username == user.username ? 'selected' : ''}`}
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
                        activeChatGroup = {activeChatGroup}
                        updateMessages={
                           message => appendMessages( message)
                        }
                      
                    />
            </div>
        </div>
    )

}
export default Chat
