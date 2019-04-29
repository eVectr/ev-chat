import React, { useState, useEffect, Fragment, useRef } from 'react'
import io from 'socket.io-client'
import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users';

//import groups from '../constants/groups';
import axios from "axios"
import { GroupModal } from '../components/GroupModal';




let socket = null

const ChatWindow = ({ groups, activeChatUser, messages, updateMessages }) => {

    const [message, setMessage] = useState('')
    
    
   

    let user = getUser()
    let msg = useRef(null)
    

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

    useEffect(() => {
        scrollToBottom();
    }, [])
 
    useEffect(() => {
        scrollToBottom();
 
    }, [message])
 
    const scrollToBottom = () => {
        document.getElementById('last-msg') && document.getElementById('last-msg').scrollIntoView();
    }



    return (

       <div className="col-9 chat-window">

           <div class="message-header">
               <h2>{activeChatUser.username}</h2>
           </div>

           <div className="message-list" ref={(el) => { msg = el; }} >

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

       </div>
   )
}

const Chat = () => {

    const [groups, setGroups] = useState([])
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [activeChatUser, setActiveChatUser] = useState(null)
    let user = getUser()

//     axios.get('http://localhost:4000/Getgroup')
//     .then(response => { 
        
//         setGroups(response.data)
//         console.log(response)
//   })



    // const appendMessages = (username, data) => {
    //     setMessages(prevMessages => {

    //         const activeUserChat = prevMessages[username] || []

    //         const updatedChat = activeUserChat.concat(data)

    //         const updatedMessages = {
    //             ...prevMessages,
    //             [username]: updatedChat
    //         }

    //         return updatedMessages
    //     })
    // }
    ////////////////////////////////

    const appendMessages = (data, user, activeChatUser) => {
       console.log("messages =>",messages)
       //if (data.author == activeChatUser.username || data.author == user.username) {
            setMessages(prevMessages => {
               // const activeUserChat = prevMessages.to || []
                
                const updatedMessages = prevMessages.concat(data)
                return updatedMessages
            })
      // }
    }

    
   
    useEffect(() => {
       //socket = io('http://localhost:6547')
       socket = io('http://209.97.142.219:6547')
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
