import React, { useState, useEffect, Fragment, useRef, } from 'react'

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

const ChatWindow = ({ user, sendStatus, activeChatGroup, isGroup, isLoading, activeChatUser, messages, updateMessages,
    setGroups, setgroupMessageCounter }) => {


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
        color: "green",
        fontSize: '.7rem',
    }


    let handleEnterShiftPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
        } else if (e.key === 'Enter') {
            sendMessage()
            e.preventDefault();
        }
        else {
        }
    }

    let handleGroupEnterShiftPress = (e) => {
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
        console.log("user ====== user==>", user)
       
        if (!message.trim().length) return

        axios.post(`https://ev2.softuvo.xyz/chatnotification`, {SentBy:user.username,
        SentTo: activeChatUser.user_id, NotificationId: user.user_id})
        .then(res => {
         
            console.log("notice res ==>", res)
          })

        var today = new Date()
        var hour = today.getHours();
        var minute = today.getMinutes();
        var date = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear()

        let time1 = hour.toString().concat(':', +minute.toString())
        let date1 = date.toString().concat('/', month.toString().concat('/', +year.toString()))
        let DateTime = date1.toString().concat(' ', time1.toString())


        const messagePayload = {
            DateTime: DateTime,
            author: user.username,
            content: message,
            to: activeChatUser.username,
            ReceiverId:activeChatUser.user_id
        }

        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendMessage', messagePayload)
        }

        let userarray = []
        users.map((user, index) => {
            userarray.push(user.username)
        })
        const counterPayload = {
            users: userarray,
            receiver: activeChatUser.username,
            sender: user.username
        }
        socket.emit('send_user_counter', counterPayload)
    }


    const sendGroupMessage = () => {

        if (!message.trim().length) return
        var today = new Date()
        var hour = today.getHours();
        var minute = today.getMinutes();
        var date = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear()

        let time1 = hour.toString().concat(':', +minute.toString())
        let date1 = date.toString().concat('/', month.toString().concat('/', +year.toString()))
        let DateTime = date1.toString().concat(' ', time1.toString())

        const messagePayload = {
            DateTime: DateTime,
            author: user.username,
            content: message,
            to: activeChatGroup._id,

        }
        updateMessages(messagePayload)
        setMessage('')

        if (socket) {
            socket.emit('sendGroupMessage', messagePayload)
        }

        set_group_counter(activeChatGroup._id, user.username)
    }
    let set_group_counter = (groupId, author) => {
        return new Promise((resolve, reject) => {
            axios.post(`https://reactchat.softuvo.xyz/getuser`, { groupId: groupId })
                .then(response => {
                    console.log("active group member==>", response)
                    let data = response.data
                    const counterPayload = {
                        groupcounter: 1,
                        groupId: groupId,
                        members: data,
                        author: author
                    }
                    resolve(socket.emit('sendGroupCounter', counterPayload))
                })
        })
    }



    let setMaxUser = (e) => {

        let groupId = activeChatGroupGlobal._id
        let maxLimit = e.target.value
        let data = [{ groupId: groupId, maxLimit: maxLimit }]
        //setMaxUserLimit([data])


        setMaxUserLimit(maxUser => ({
            ...maxUser, data
        }))


    }

    let saveMembers = () => {
        axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId: activeChatGroup._id, users: members, maxuser: maxUser })
            .then(res => {
                socket.emit('add_member', members)
                let msg = res.data
                if (!msg) {
                    setError(true)
                }
                if (msg) {
                    setLogin(true)
                    setshowModal(false)
                    setMembers([])
                }
                /////////////////////////
                if (msg) {
                    let note = user.username + "  " + 'Added' + "  " + members
                    //axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to:activeChatGroup._id, note:note})
                    // .then(save_res =>{
                    // axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to:activeChatGroup._id})
                    // .then(get_res =>{
                    //  setGroupNote(JSON.parse(get_res.data[0]))
                    //   setMessage(JSON.parse(get_res.data[0]))
                    //    setMessage(note)

                    const messagePayload = {
                        DateTime: '',
                        author: user.username,
                        content: '',
                        to: activeChatGroup._id,
                        notice: note
                    }

                    updateMessages(messagePayload)
                    setMessage('')
                    //setGroupNote('')
                    socket.emit('sendGroupMessage', messagePayload)

                    // })
                    // })
                } /////// end if 
            })
    }



    useEffect(() => {
        setTimeout(() => setShow(false), 5000)
    }, [show])

    useEffect(() => {
        setTimeout(() => setLogin(false), 2000)
    }, [login])




    let getMembers = () => {
        let groupId = activeChatGroup._id
        axios.post(`https://reactchat.softuvo.xyz/getuser`, { groupId: groupId })
            .then(response => {
                console.log("active group member==>", response)
                let data = response.data
                setList(data)
            }) //////////////////////// LIMIT
        axios.post(`https://reactchat.softuvo.xyz/getgrouplimit`, { groupId: groupId })
            .then(res => {
                setMaxUserLimit(res.data.grouplimit)
            })
    }


    let deleteMember = (user) => {
        let groupId = activeChatGroup._id
        axios.post(`https://reactchat.softuvo.xyz/removeuser`, { groupId, user })
            .then(response => {
                socket.emit('remove_member', user)
                axios.post(`https://reactchat.softuvo.xyz/getuser`, { groupId: groupId })
                    .then(res => {
                        setList(res.data)
                    })
            })
        ///////////////////////////////////////////////////////////
        let note = activeChatGroup.admin + " " + "Removed" + " " + user
        axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to: activeChatGroup._id, note: note })
            .then(save_res => {
                axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to: activeChatGroup._id })
                    .then(get_res => {
                        // setGroupNote(JSON.parse(get_res.data[0]))
                        setMessage(note)
                        const messagePayload = {
                            DateTime: '',
                            author: user.username,
                            content: '',
                            to: activeChatGroup._id,
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


    let leftgroup = (user) => {
        return new Promise((resolve, reject) => {
            ////////////////
            let note = user + "  " + 'Left' + "  " + "Group"
            axios.post(`https://reactchat.softuvo.xyz/save_group_note`, { to: activeChatGroup._id, note: note })
                .then(save_res => {
                    axios.post(`https://reactchat.softuvo.xyz/get_group_note`, { to: activeChatGroup._id })
                        .then(get_res => {
                            // setGroupNote(JSON.parse(get_res.data[0]))
                            setMessage(note)
                            const messagePayload = {
                                DateTime: '',
                                author: '',
                                content: '',
                                to: activeChatGroup._id,
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

    let exitGroup = (user) => {

        let groupId = activeChatGroup._id
        axios.post(`https://reactchat.softuvo.xyz/removeuser`, { groupId, user })
            .then(response => {
                axios.post(`https://reactchat.softuvo.xyz/getuser`, { groupId: groupId })
                    .then(res => {
                        setList(res.data)

                    })
            })

        leftgroup(user).then(res => {
            window.location.reload()
        })
    }


    let deleteGroup = () => {
        let groupId = activeChatGroup._id
        axios.post(`https://reactchat.softuvo.xyz/getuser`, { groupId: groupId })
            .then(member => {
                socket.emit('delete_group', member.data)
            })
        axios.post(`https://reactchat.softuvo.xyz/removegroup`, { groupId })
            .then(response => {
                axios.get(`https://reactchat.softuvo.xyz/Getgroup`)
                    .then(res => {
                        setGroups(res.data)

                    })
            })
        window.location.reload()
    }


    let handleChange = data => {
        let array = []
        data.map((member) => {
            array.push(member.value)
        })
        setMembers(array)

    }


    let showGroupModal = (isModal) => {
        setshowModal(isModal)
        setError(false)
    }

    let changeUserLimit = (e) => {

        if (e.target.value.length) {
            set_limit_disable(false)
        } else {
            set_limit_disable(true)
        }
        setuserLimit(e.target.value)
    }

    let saveUserLimit = (editUser) => {
        axios.post(`https://reactchat.softuvo.xyz/editlimit`, { grouplimit: userLimit, groupId: activeChatGroup._id })
            .then(res => {
                setMaxUserLimit(res.data.grouplimit)
            })

        setMaxUserLimit('')
        setEditUser(editUser)


    }

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    console.log("active chat user ==>", activeChatUser)

    return (
        <div className="col-9 chat-window">

            {
                isGroup ? <Fragment>
                    {


                        activeChatGroup._id ?
                            <div class="show-chat" >

                                <div class="message-header">
                                    <div>
                                        <h2>{(activeChatGroup.groupname).capitalize()}</h2>
                                        <GroupMemberModal deleteGroup={deleteGroup} exitGroup={exitGroup} getMembers={getMembers} user={user.username} admin={activeChatGroup.admin} list={list} deleteMember={deleteMember} members={members} />
                                    </div>
                                    <span><GroupModal maxUser={maxUser}
                                        editUser={editUser}
                                        changeUserLimit={changeUserLimit}
                                        saveUserLimit={saveUserLimit}
                                        setEditUser={setEditUser}
                                        showModal={showModal}
                                        showGroupModal={showGroupModal}
                                        saveMembers={saveMembers} admin={activeChatGroup.admin}
                                        user={user.username} list={list} handleChange={handleChange}
                                        setMaxUser={setMaxUser}
                                        limit_disable={limit_disable}
                                        getMembers={getMembers} error={error} show={show} msg={msg} members={members} ></GroupModal></span>
                                </div>
                                {login ? <SucessfullMessage /> : null}
                                <div className="message-list" ref={(el) => { msg = el; }} >
                                    {isLoading ? <Loader /> : null}


                                    {
                                        messages.map(
                                            (message, index) => (
                                                <Fragment>
                                                    {message.content ?

                                                        <div key={index} id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
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
                                                                        <div className='msg-date-time'>
                                                                            {message.DateTime}
                                                                        </div>
                                                                        <p className='status'>{user.username == message.author ?

                                                                            <Fragment>{(index == messages.length || index == messages.length - 1) ?
                                                                                <Fragment>
                                                                                    {(sendGroupStatus == 'sent' || sendGroupStatus == '') ? <i class="fa fa-check" aria-hidden="true"></i> : ''}
                                                                                </Fragment>
                                                                                : ''}
                                                                            </Fragment>


                                                                            : null}</p>


                                                                    </div></pre>

                                                            </div>

                                                        </div>
                                                        :
                                                        <div key={index} id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container notification-center`}>
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
                                    <div class="input-group-append" onClick={isGroup ? sendGroupMessage : ''}>
                                        <span class="input-group-text send-icon-container">
                                            <i class="fas fa-paper-plane"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            : null
                    }

                </Fragment> :
                    <Fragment>

                        {
                            activeChatUser.username ?
                                <div class="show-chat">
                                    <div class="message-header">
                                        <h2>{activeChatUser.username}</h2>
                                    </div>
                                    <div className="message-list" ref={(el) => { msg = el; }} >
                                        {isLoading ? <Loader /> : null}
                                        {
                                            messages.map(
                                                (message, index) => (

                                                    <div key={index} id="last-msg" id={index == messages.length - 1 ? 'last-msg' : ''} className={`message-bubble-container ${user.username == message.author ? 'right' : 'left'}`}>
                                                        <div class="alert alert-light message-bubble" >

                                                            <pre className="m-0 messages">{message.content}
                                                                <div className="date">
                                                                    <div style={DateTimeStyle}>
                                                                        {message.DateTime}

                                                                    </div>
                                                                    <p className='status'>{user.username == message.author ?

                                                                        <Fragment>{(index == messages.length || index == messages.length - 1) ?
                                                                            <Fragment>
                                                                                {(sendStatus == 'sent' || sendStatus == '') ? <i class="fa fa-check" aria-hidden="true"></i> : <i class="fas fa-check-double"></i>}
                                                                            </Fragment>
                                                                            : ''}
                                                                        </Fragment>

                                                                        : null}</p>

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
                                        <div class="input-group-append" onClick={isGroup ? '' : sendMessage}>
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


const Chat = (props) => {


    const [groups, setGroups] = useState([])
    const [filteredgroups, setFilteredGroups] = useState([])
    const [groupname, setGroupName] = useState()
    const [isGroup, setisGroup] = useState()
    const [messages, setMessages] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [activeChatUser, setActiveChatUser] = useState({ username: '' })
    const [activeChatGroup, setActiveChatGroup] = useState({ groupname: '' })
    const [hide, setHide] = useState(false)
    const [userSelected, setUserSelected] = useState()
    const [groupSelected, setGroupSelected] = useState()
    const [checklogin, setCheckLogin] = useState(true)
    const [sendStatus, setSendStatus] = useState('')
    const [load, setLoad] = useState(false)
    const [groupNote, setGroupNote] = useState('')
    let [messageCounter, setMessageCounter] = useState(0)
    let [counterCheck, setCounterCheck] = useState(false)
    let [p2pCounterCheck, setp2pCounterCheck] = useState(false)
    let [counterGroup, setCounterGroup] = useState('')
    const [groupMessageCounter, setgroupMessageCounter] = useState([])
    let [userCounter, setuserCounter] = useState([])


    let user = getUser()

    useEffect(() => {
        // let isExists = filteredUser.map(value => {
        //     let id = props.location.pathname.split('/')[2]
        //     return { id = value.user_id ? setActiveChatUser(value) : null}
        // })
       
        if(props.location.pathname.split('/')[2] != undefined){
            let isExists = filteredUser.map(value => {
                let id = props.location.pathname.split('/')[2]
                return  id == value.user_id ? setActiveChatUser(value) : null
            })
        }
        //console.log("check propsss =>", props.location.pathname.split('/')[2])
        //socket = io('http://localhost:6565')
        socket = io('https://reactchat.softuvo.xyz')
        socket.emit('newConnection', user)
        socket.on('seen', data => {
            setSendStatus(data)
        })
        // socket.on('misedchat', data => {
        //     alert("jgkgh")

        // })

        socket.on('get_add_members', data => {
            window.location.reload()
        })
        socket.on('get_remove_members', data => {
            window.location.reload()
        })
        socket.on('get_delete_group', data => {
            window.location.reload()
        })
        socket.on('delete_counter', data => {
            //  setCounterCheck(false)
            axios.post('https://reactchat.softuvo.xyz/deletegroupcounter', { groupId: data.groupId, member: data.member })
                .then(res => {
                    axios.get('https://reactchat.softuvo.xyz/Getgroup')
                        .then(response => {
                            let groupCounterArray = []
                            response.data.map((group) => {
                                axios.post(`https://reactchat.softuvo.xyz/getgroupcounter`, { groupId: group._id, member: user.username })
                                    .then(res => {
                                        if (activeChatGroup._id !== group._id) {

                                            setCounterCheck(true)
                                            if (res.data.groupId == group._id) {
                                                groupCounterArray.push(res.data)
                                                return
                                            } else {
                                                let data = {
                                                    groupcounter: 0,
                                                    groupId: group._id
                                                }
                                                groupCounterArray.push(data)
                                            }
                                            setgroupMessageCounter(groupCounterArray)
                                        }
                                    })
                            })
                        })
                })
        })

        // socket.on('delete_p2p_counter', data =>{
        //     axios.post(`https://reactchat.softuvo.xyz/deletep2pcounter`, { receiver:data.sender, sender:data.receiver })
        //     .then(res =>{   
        //         let array = []       
        //         filteredUser.map((sender) =>{
        //         axios.post(`https://reactchat.softuvo.xyz/getp2pcounter`, { receiver:user.username, sender:sender.username })
        //         .then(res =>{
        //         if(res.data.length > 0){
        //              array.push(JSON.parse(res.data))

        //          }
        //         })
        //     })
        //     setp2pMessageCounter(array)
        //     setp2pCounterCheck(true)

        //     })
        // })

    }, [])

    useEffect(() => {
        axios.get('https://reactchat.softuvo.xyz/Getgroup')
            .then(response => {
                setGroups(response.data)
                set_group_message_counter()
                // let groupCounterArray = []
                // response.data.map((group) => {
                //     axios.post(`https://reactchat.softuvo.xyz/getgroupcounter`, { groupId: group._id, member: user.username })
                //         .then(res => {
                //             if (activeChatGroup._id !== group._id) {

                //                 setCounterCheck(true)
                //                 if (res.data.groupId == group._id) {
                //                     groupCounterArray.push(res.data)

                //                 } else {
                //                     let data = {
                //                         groupcounter: 0,
                //                         groupId: group._id
                //                     }
                //                     groupCounterArray.push(data)
                //                 }
                //                 setgroupMessageCounter(groupCounterArray)
                //             }
                //         })
                // })
            })

    }, [filteredgroups])


    // useEffect(() => {   
    //     let array = []       
    //     filteredUser.map((sender) =>{
    //         axios.post(`https://reactchat.softuvo.xyz/getp2pcounter`, { receiver:user.username, sender:sender.username })
    //             .then(res =>{
    //                 if(res.data.length > 0){
    //                      array.push(JSON.parse(res.data))

    //                 }
    //             })

    //     })
    //    setp2pMessageCounter(array)
    //    setp2pCounterCheck(true)

    // },[])


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
        fontSize: '22px',
        marginRight: '10px'
    }

    let appendMessages = (data) => {
        let check = (user.username == data.to)
        if (check) {
            notifyMe()
        }
        if (data.author == activeChatUserGlobal.username || data.author == user.username) {
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.concat(data)
                return updatedMessages
            })
        }
        let usercounter = []
        users.map((user, index) => {
            usercounter.push(user.username)
        })
        const payload = {
            users: usercounter,
            receiver: activeChatUser.username,
            sender: user.username
        }
        socket.emit('get_user_counter', payload)
        socket.on('receive_user_counter', data =>{
            console.log("receive_user_counter =>", data)
        })
    }



    let appendGroupMessages = (data) => {
        setCounterGroup(data.to)
        if (data.to == activeChatGroupGlobal._id || data.author == user.username) {
            setMessages(prevGroupMessages => {
                const updatedMessages = prevGroupMessages.concat(data)
                return updatedMessages
            })
        }
        axios.post('https://reactchat.softuvo.xyz/getuser', { groupId: data.to })
            .then(members => {
                let array = members.data
                for (let i = 0; i < array.length; i++) {
                    if (array[i] != data.author) {
                        notifyMe()
                        break
                    } else {
                        continue
                    }
                }
            })
    
        set_group_message_counter()
    }
    
    let set_group_message_counter = () => {
            let array = []
            axios.get('https://reactchat.softuvo.xyz/Getgroup')
                .then(response => {
                    let promise = response.data.map((group, index) => {
                        return new Promise((resolve) => {
                            axios.post(`https://reactchat.softuvo.xyz/getgroupcounter`, { groupId: group._id, member: user.username })
                                .then(res => {
                                    if (activeChatGroup._id !== group._id) {
                                        setCounterCheck(true)
                                        if (res.data.groupId == group._id) {
                                            array.push(res.data)
                                            resolve(array)
                                        } else {
                                            let data = {
                                                groupcounter: 0,
                                                groupId: group._id
                                            }
                                            array.push(data)
                                            resolve(array)
                                        }
                                    }
                                })
                        })
                    })
                  
                    Promise.all(promise).then(res => {
                        console.log(res[0], '=> promise.all res')
                        setgroupMessageCounter(res[0])
                    })
                })
        
}

let handleChatMouseUp = () => {
    setisGroup(false)
    setUserSelected(true)
    setGroupSelected(false)

}

let handleGroupChatMouseUp = () => {
    setisGroup(true)
    setUserSelected(false)
    setGroupSelected(true)

}


let saveGroupName = () => {
    setLoad(true)

    axios.post(`https://reactchat.softuvo.xyz/Creategroup`, { groupname, admin: user.username, grouplimit: 5, members: [user.username] })
        //axios.post(`https://reactchat.softuvo.xyz/grouplimit`, {grouplimit:5, groupId:groupId })
        .then(res => {
            let users = user.username
            //axios.post(`https://reactchat.softuvo.xyz/adduser`, { groupId:groupId, users:[user.username] })
            axios.get('https://reactchat.softuvo.xyz/Getgroup')
                .then(response => {
                    let active = {
                        groupname,
                        admin: user.username
                    }
                    setGroups(response.data)
                    setLoad(false)
                    setisGroup(true)
                    setUserSelected(false)
                    setGroupSelected(true)
                    setActiveChatGroup(active)
                })
        })
    setHide(false)
    setGroupName('')

}


let handleClose = () => {
    setHide(false)
}

let handleShow = () => {
    setHide(true)
}


const setGroupNames = e => setGroupName(e.target.value)


useEffect(() => {
    if (user && user.username) return
    props.history.push('/')
}, [])


useEffect(() => {
    setLoading(true)
    activeChatUserGlobal = activeChatUser
    const func = (data) => {
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
}, [activeChatGroup._id])


useEffect(() => {
    if (activeChatUser && activeChatUser.username) {
        socket.emit('join', { author: user.username, to: activeChatUser.username })
        socket.on('message', conversation => {
            const { data = {} } = conversation
            setLoading(false)
            setMessages(data)
        })
    }
}, [activeChatUser.username])


useEffect(() => {

    if (activeChatGroup && activeChatGroup._id) {
        socket.emit('groupjoin', { author: user.username, to: activeChatGroup._id })
        socket.on('groupmessage', conversation => {
            const { data = {} } = conversation
            setLoading(false)
            setMessages(data)
        })
    }
}, [activeChatGroup._id])


useEffect(() => {
    setTimeout(function () { setCheckLogin(false) }, 1000)
    
}, [])


useEffect(() => {
    const promiseArr = groups.map((group) => {
        let groupId = group._id
        // return axios.post('http://localhost:6565/getuser', {groupId:groupId})
        return axios.post('https://reactchat.softuvo.xyz/getuser', { groupId: groupId })

    })
    Promise.all(promiseArr)
        .then(values => {
            const validGroups = groups.filter(
                (_, index) => {
                    if (values[index].data.length) {

                        let member = user.username
                        return values[index].data.includes(member)
                    }
                }
            )

            setFilteredGroups(validGroups)
        })
}, [groups.length, messageCounter.length])


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
    filteredgroups.map(
        (group, index) => {
            if (activeChatGroup && activeChatGroup._id == group._id) {

                axios.post('https://reactchat.softuvo.xyz/deletegroupcounter', { groupId: group._id, member: user.username })
                    .then(res => {
                        axios.get('https://reactchat.softuvo.xyz/Getgroup')
                            .then(response => {
                                let groupCounterArray = []
                                response.data.map((resgroup) => {
                                    axios.post(`https://reactchat.softuvo.xyz/getgroupcounter`, { groupId: resgroup._id, member: user.username })
                                        .then(res => {
                                            if (activeChatGroup._id !== group._id) {

                                                setCounterCheck(true)
                                                if (res.data.groupId == group._id) {
                                                    groupCounterArray.push(res.data)
                                                    return
                                                } else {
                                                    let data = {
                                                        groupcounter: 0,
                                                        groupId: group._id
                                                    }
                                                    groupCounterArray.push(data)
                                                }
                                                setgroupMessageCounter(groupCounterArray)
                                            }
                                        })
                                })
                            })
                    })
            }
        })
}, [groupMessageCounter])

let setChatId = (user) =>{
    props.history.push('/chat/' + user.user_id)
    console.log("test userrrrr =>", user)
}


return (
    <div className="chat-container full-height container-fluid"  >
        {props.auth.loginSucess && checklogin ? <Alert color="primary login-msg">{props.auth.loginSucess}</Alert> : null}
        <modal></modal>
        <div className="row full-height">

            <aside className="users-list col-3">
                <div className="user-logout">
                    <span>{user.username}</span>
                    <button onClick={userLogOut}><i class="fas fa-sign-out-alt"></i></button>
                </div>
                <CreateGroupModal setGroupNames={setGroupNames} groupname={groupname} saveGroupName={saveGroupName} handleClose={handleClose} hide={hide} handleShow={handleShow} load={load} />

                <div className="aside-item">

                    {load ? <Loader /> : null}

                    {
                    }

                    {<ul className="list-group">

                        {
                            filteredgroups.map(
                                (group, index) => {

                                    return (
                                        <li className='list-group-item user'
                                            key={index}
                                            onMouseUp={handleGroupChatMouseUp}
                                            onClick={() => {
                                                setActiveChatGroup(group)
                                                setActiveChatUser({})
                                            }}

                                            className={`list-group-item user ${(activeChatGroup && activeChatGroup._id == group._id) && groupSelected ? 'selected' : ''}`}
                                        >
                                            <div className='group-list'>
                                                <div>
                                                    <i class="fas fa-users" style={groupicon} ></i>
                                                    <span className="username">{group.groupname}</span>
                                                </div>


                                                <div>
                                                    {
                                                        counterCheck && activeChatGroup._id != group._id ?
                                                            //    groupMessageCounter[0].groupcounter >0?
                                                            <Fragment>
                                                                {
                                                                    groupMessageCounter.map((counter) => {


                                                                        if (group._id == counter.groupId && counter.GroupCounter > 0) {
                                                                            return <span className='msg-counter'>{counter.GroupCounter} </span>
                                                                        }
                                                                    })
                                                                    // group.groupId ==  groupMessageCounter[0].groupId 
                                                                    // && groupMessageCounter[0].groupcounter>0? <span className='msg-counter'>{ groupMessageCounter[0].groupcounter} </span>: ''
                                                                }

                                                            </Fragment> : ''
                                                    }
                                                </div>

                                            </div>
                                        </li>
                                    )
                                }

                            )
                        }
                    </ul>}

                    <ul className="list-group">
                        {
                            filteredUser.map(
                                (user, index) =>

                                    <li
                                        key={index}
                                        onMouseUp={handleChatMouseUp}
                                        onClick={() => {
                                            setChatId(user)
                                            setActiveChatUser(user)
                                            setActiveChatGroup({})
                                        }}
                                        className={`list-group-item user ${
                                            (activeChatUser && activeChatUser.username == user.username) && userSelected ? 'selected' : ''

                                            }`}
                                    >
                                        <i class="fas fa-user-circle user-profile-photo"></i>
                                        <span className="username">{user.username}</span> &nbsp; &nbsp;

                                            {
                                            userCounter.map((counter) => {
                                                if (counter.counter > 0 && user.username == counter.sender
                                                    && activeChatUser.username != user.username && p2pCounterCheck) {
                                                    return <span className='msg-counter'>{counter.counter} </span>
                                                }
                                            })
                                        }
                                        {
                                            // p2pMessageCounter.counter> 0 && user.username == p2pMessageCounter.sender
                                            // && activeChatUser.username != user.username && p2pCounterCheck? 
                                            // <span className='msg-counter'>{ p2pMessageCounter.counter} </span>:'' 
                                        }



                                    </li>

                            )
                        }
                    </ul>

                </div>
            </aside>
            <ChatWindow
                user={user}
                isGroup={isGroup}
                isLoading={isLoading}
                groups={groups}
                messages={activeChatMessages}
                activeChatUser={activeChatUser}
                activeChatGroup={activeChatGroup}
                sendStatus={sendStatus}
                updateMessages={
                    message => appendMessages(message)
                }
                updateGroupMessages={
                    message => appendGroupMessages(message)
                }
                notifyMe={notifyMe}
                groupNote={groupNote}
                setGroupNote={setGroupNote}
                messageCounter={messageCounter}
                setMessageCounter={setMessageCounter}
                setgroupMessageCounter={setgroupMessageCounter}

            />
        </div>
    </div>
)

}

export default connect(state => state)(Chat)
