import React, { useState, useEffect, Fragment, useRef } from 'react'
import io from 'socket.io-client'
import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users';
import axios from "axios"
import { GroupModal } from '../components/GroupModal';
import Loader from '../components/Loader'
import CreateGroupModal from '../components/CreateGroupModal'




let socket = null
let activeChatUserGlobal = {}

const ChatWindow = ({ groups, isLoading, activeChatUser, messages, updateMessages }) => {

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
    }, [messages.length])
 
    const scrollToBottom = () => {
        document.getElementById('last-msg') && document.getElementById('last-msg').scrollIntoView();
    }

    console.log(activeChatUser, 'activeChatUser')
    
    return (

       <div className="col-9 chat-window">

            {isGroup? <Fragment>

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
                        <div class="input-group-append" onClick={sendMessage}>
                            <span class="input-group-text send-icon-container">
                                <i class="fas fa-paper-plane"></i>
                            </span>
                        </div>
                    </div>
                </div> : null
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
    const [isArray, setisArray] = useState()
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [activeChatUser, setActiveChatUser] = useState({username : ''})
    const [activeChatGroup, setActiveChatGroup] = useState({groupname : ''})
    const [hide, setHide] = useState(false)
    
    let user = getUser()
    

    const activeChatUserName = activeChatUser && activeChatUser.username


    // useEffect(() => {
    //     axios.get('http://localhost:4000/Getgroup')
    //     .then(response => {
    //      setGroups(response.data)
    //       console.log("API groups",response.data)
    //      })
    // },[])

let saveGroupName= ()=>{
    setHide(false)
    if(groups.length == 0){
        setisArray(false)
    }else{
        setisArray(true)
    }
}

    let handleClose = () => {
       setHide(true)
    }
    
    let handleShow=() => {
        setHide(false)
    }
    
    
    const setGroupName = (e) => {
        setGroups([e.target.value])
        
    } 

    
    
    console.log("iaArray", isArray)



    let appendMessages = (data) => {
       if (data.author == activeChatUserGlobal.username || data.author == user.username) {
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.concat(data)
                return updatedMessages
            })
       }
    }


    useEffect(() => {
       if (user && user.username) return
       history.push('/')
    },[])
       
    
        


    useEffect(() => {
    // socket = io('http://localhost:6547')
    socket = io('http://209.97.142.219:6547')
         socket.emit('newConnection', user)
    })
   
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

    let userLogOut = () => {
        localStorage.clear()
        history.push('/')
    }
   
    let groupicon ={
      fontSize:'22px',
      marginRight:'10px'
    }
    
    return (
        
        <div className="chat-container full-height container-fluid">
        <modal></modal>
            <div className="row full-height">
                
                <aside className="users-list col-3">
                    <div className="user-logout">
                        <span>{user.username}</span>
                        <button onClick={userLogOut}><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                <CreateGroupModal setGroupName={setGroupName} groups ={groups} saveGroupName={saveGroupName} handleClose={handleClose} hide={hide} handleShow={handleShow}/>
            
            {isArray?
                <ul className="list-group">
                        {
                            groups.map(
                                (group, index) =>
                               
                                    <li
                                        key={index}
                                       // onClick={() => setActiveChatGroup(group)}
                                        //className={`list-group-item user ${activeChatGroup && activeChatGroup.groupname == group ? 'selected' : ''}`}
                                    >
                                        <i class="fas fa-users" style ={groupicon} ></i>
                                        <span className="username">{group}</span>
                                        
                                    </li>
                                    
                            )
                        }
                    </ul>
                :null}
            
                
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
                    <ChatWindow
                        isLoading={isLoading}
                        groups ={groups}
                        messages={activeChatMessages}
                        activeChatUser={activeChatUser}
                        updateMessages={
                           message => appendMessages( message)
                        }
                      
                    />
            </div>
        </div>
    )

}
export default Chat
