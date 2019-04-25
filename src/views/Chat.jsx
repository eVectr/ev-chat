import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { getUser } from '../utils/auth'
import users from '../constants/users';




let socket = null

const ChatWindow = ({ activeChatUser, messages, updateMessages }) => {


    const [message, setMessage] = useState('')
   

    let user = getUser()

    useEffect(() => {
       socket = io('http://209.97.142.219:6547',
       //socket = io('http://localhost:6547',
        {
            path: '/socket.io',
            transports: ['websocket'],
            secure: true,
        })
        socket.emit('newConnection', user)
    }, [])


    const sendMessage = () => {

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



    return (
        <div className="col-9 chat-window">
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

    const [messages, setMessages] = useState([])
    const [activeChatUser, setActiveChatUser] = useState(null)
    let user = getUser()

    

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



    const appendMessages = data => {
        setMessages(prevMessages => {
            const updatedMessages = prevMessages.concat(data)
            return updatedMessages
        })
    }

    
   
    useEffect(() => {
       socket = io('http://209.97.142.219:6547',{
       
       //socket = io('http://localhost:6547',{
        path: '/socket.io',
         transports: ['websocket'],
         secure: true,
        })
        socket.emit('newConnection', user)
       // socket.on('receivedMessage', data => appendMessages(data.author, data))
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
