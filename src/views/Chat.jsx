import React, { useState, useEffect, Fragment, useRef } from 'react'

import io from 'socket.io-client'
import axios from "axios"

import { GroupModal } from '../components/GroupModal'
import Loader from '../components/Loader'
import CreateGroupModal from '../components/CreateGroupModal'
import AddUserModal from '../components/AddUserModal'

import { getUser, getGroup } from '../utils/auth'
import users from '../constants/users'
import Sucess from '../components/FlashMessage'




let socket = null
let activeChatUserGlobal = {}

const ChatWindow = ({ groups,activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages }) => {

   
    const [message, setMessage] = useState('')
    const [sendStatus, setSendStatus] = useState('')
    const [status, setStatus] = useState('')

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
        marginLeft:'8px'
    }


   let  handleEnterShiftPress = (e) => {
       console.log(e.key)
       if (e.key === 'Enter' && e.shiftKey) {
       // if (e.key === ' ') {
            // console.log('handleEnterShiftPress')
            // e.preventDefault();
            // addNewLineToTextArea();
        } else if (e.key === 'Enter') {
            sendMessage()
            e.preventDefault();
         }
          else {
            
         }
       
    }

    // let handleEnterPress= (e)=> {
    //     if (e.key === 'Enter') {
    //         sendMessage()
    //     }
    //   }
   
    const scrollToBottom = () => {
        document.getElementById('last-msg') && document.getElementById('last-msg').scrollIntoView();
    }

    const sendMessage = () => {

        if (!message.trim().length) return

        var today = new Date()
        var hour = today.getHours();         
        var minute = today.getMinutes();
        var date = today.getDate();
        console.log(date)
        var month = today.getMonth() + 1;
        var year = today.getFullYear()
        

        let time1 = hour.toString().concat(':',+minute.toString())
        let date1 = date.toString().concat('/',month.toString().concat('/',+year.toString()))
        let DateTime = time1.toString().concat(" ",date1.toString())
     
        
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

    const [show, setShow] = useState(false)
    
  

    return (

       <div className="col-9 chat-window">
       
            {
                isGroup? <Fragment>
            {
                
                activeChatGroup.groupname ? 
                <div class="show-chat" >
                     <div class="message-header">
                        <h2>{activeChatGroup.groupname}</h2><span><GroupModal user ={user.username}></GroupModal></span>
                        
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
                                        
                                        <pre>{message.content}</pre>
                                            
                                        </div>
                                        <div className="date">
                                            <div style = {DateTimeStyle}>
                                                {message.DateTime}
                                            </div>
                                            <p className='status'>{user.username == message.author ?sendStatus:null}</p>
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

const Chat = ({ history }) => {

    const [groups, setGroups] = useState([])
    const [groupname, setGroupName] = useState()
    const [isGroup, setisGroup] = useState()
    const [messages, setMessages] = useState([])
    const [groupMessages, setgroupMessages] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [activeChatUser, setActiveChatUser] = useState({username : ''})
    const [activeChatGroup, setActiveChatGroup] = useState({groupname : ''})
    const [hide, setHide] = useState(false)
    const [show, setShow] = useState(true)

    useEffect(() => {
       // socket = io('http://localhost:6547')
        socket = io('http://209.97.142.219:6547')
             socket.emit('newConnection', user)
        })
 

    useEffect(() => {
       // axios.get('http://localhost:4000/Getgroup')
        axios.get('http://209.97.142.219/Getgroup')
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

    

let saveGroupName= ()=>{
    //axios.post(`http://localhost:4000/Creategroup`, { groupname:groupname, admin:user.username })
    axios.post(`http://209.97.142.219:4000/Creategroup`, { groupname:groupname, admin:user.username })
      .then(res => {
        console.log(res);
        console.log(res);
        console.log("sucess")
       // axios.post(`http://localhost:4000/adduser`, { groupname:groupname, users:[user.username] })
        axios.post(`http://209.97.142.219:4000/adduser`, { groupname:groupname, users:[user.username] })
        //axios.get('http://localhost:4000/Getgroup')
        axios.get('http://209.97.142.219:4000/Getgroup')
       // axios.get('http://209.97.142.219:4000/Deletegroup')
        .then(response => {
         setGroups(response.data)
          console.log("API groups",response.data)
         })
      })
      setHide(false)  
  }




    let handleClose = () => {
       setHide(true)
    }
    
    let handleShow=() => {
        setHide(false)
    }
    
    const setGroupNames = (e) => {
        setGroupName(e.target.value)
        
    }
    
    


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

    let userLogOut = () => {
        localStorage.clear()
        history.push('/')
    }
   
    let sucess = () => {
        setShow(false)
    }
    
    return (
        
        <div className="chat-container full-height container-fluid" onLoad={sucess} >
        <Sucess/>
        
        <modal></modal>
            <div className="row full-height">
                
                <aside className="users-list col-3">
                    <div className="user-logout">
                        <span>{user.username}</span>
                        <button onClick={userLogOut}><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                <CreateGroupModal setGroupNames={setGroupNames} groupname={groupname} saveGroupName={saveGroupName} handleClose={handleClose} hide={hide} handleShow={handleShow}/>
            
                <ul className="list-group">
                        {
                            groups.map(
                                (group, index) =>
                               
                                    <li className= 'list-group-item user'
                                        key={index}
                                        onMouseUp={()=> setisGroup(true) }
                                        onClick={() => setActiveChatGroup(group)}
                                        className={`list-group-item user ${activeChatGroup && activeChatGroup.groupId == group.groupId ? 'selected' : ''}`}
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
