import React, { useState, useEffect, Fragment } from 'react'
import io from 'socket.io-client'
import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users';
//import groups from '../constants/groups';
import axios from "axios"
import { GroupModal } from '../components/GroupModal';




let socket = null

const ChatWindow = ({ groups, activeChatUser, messages, updateMessages }) => {

    const [message, setMessage] = useState('')
    console.log(groups)
    
   

    let user = getUser()
    //let group = getGroup()


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

    let groupstyle = {
        color:"red"
    }

    let isGroup= false
    const checkGroup = () =>{
        isGroup = !isGroup
    }


    return (
        <div className="col-9 chat-window">
        
            {
                isGroup ? 
                <Fragment>
                    <div class="message-header">
                <h2>{activeChatUser.username}</h2>
              </div>
              <div className="message-list">
                    {
                        messages.map(
                            (message, index) => (
                                <div key={index} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                    <div class="alert alert-light message-bubble">

                                <div>
                                </div>
                                
                                    <div style = {groupstyle}>
                                    {message.author}
                                    </div>
                                    {message.content}
                                    </div >   </div>
                                
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
                </Fragment> : <Fragment>
                <div class="message-header">
                <h2>{activeChatUser.username}</h2>
            </div>
            <div className="message-list">
                    {
                        messages.map(
                            (message, index) => (
                                <div key={index} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                    <div class="alert alert-light message-bubble">
                                   
                                    {message.content}
                                    </div >   </div>
                                
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
                </Fragment>
                
                
            }
        </div>
   )
}

const Chat = () => {

    const [groups, setGroups] = useState([])
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [activeChatUser, setActiveChatUser] = useState(null)
    let user = getUser()
   

    axios.get('http://localhost:4000/Getgroup')
    .then(response => { 
        
        setGroups(response.data)
        console.log(response)
  })


    const appendMessages = data => {
        if (data.from == activeChatUser.username || data.from == user.username) {
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.concat(data)
                return updatedMessages
            })
        }
    }

    
   
    useEffect(() => {
       socket = io('http://localhost:6547')
      // socket = io('http://209.97.142.219:6547')
        socket.emit('newConnection', user)
        socket.on('receivedMessage', appendMessages)
        
    }, [])

  

    useEffect(() => {
        if (activeChatUser) {
            socket.emit('join', {author:user.username, to: activeChatUser.username })
            socket.on('message', conversation =>{
                const {  data =  {} } = conversation
                console.log("data =>", data)
                setMessages(data)
                
           })
         
        }
    }, [activeChatUser && activeChatUser.username])

   
    const filteredUser = users.filter(exisitingUser => user.username != exisitingUser.username)
    const filteredGroup = groups.filter(exisitingGroup => groups.groupname)
    console.log(filteredGroup)
    //console.log("filtered user ==>",filteredUser)
    const activeUserName = activeChatUser && activeChatUser.username || ''
    //const activeChatMessages = messages[activeUserName] || []
    const activeChatMessages = messages
    
    
    return (
        
        <div className="chat-container full-height container-fluid">
        <modal></modal>
            <div className="row full-height">
            
                <aside className="users-list col-3">
                 
                

                 <ul className="list-group">
                        {
                            groups.map(
                                (group, index) =>
                               
                                    <li
                                        key={index}
                                        
                                        className={`list-group-item user ${group.groupname ? 'selected' : ''}`}
                                    >
                                        <i class="fas fa-user-circle user-profile-photo"></i>
                                        <span className="username">{group.groupName}</span>
                                        
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
                { activeChatUser ?
                    <ChatWindow
                        groups ={groups}
                        messages={activeChatMessages}
                        activeChatUser={activeChatUser}
                        updateMessages={
                          // message => appendMessages(activeChatUser.username, message)
                           message => appendMessages( message)
                        }
                    />
                : null }
            </div>
        </div>
    )

}

export default Chat
