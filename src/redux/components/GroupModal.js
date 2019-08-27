import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'

import AddUserModal from '../components/AddUserModal'

import '../styles/groupmodal.css'
import '../styles/groupbutton.css'

import users from '../constants/users'




export class GroupModal extends Component {

  // state={
  //   editUser : false
  // }
 
  // showUserEditField = () => {
  //   this.setState({
  //     editUser:!this.state.editUser
  //   })
  // }

 render() {
   const { editUser,limit_disable ,maxUser, setEditUser, changeUserLimit, saveUserLimit, showModal, saveMembers, admin, user, list, handleChange,  getMembers, error, show, showGroupModal, members } = this.props
   let isdisableSave = true
   if (members.length) {
     isdisableSave = false
   }

console.log(maxUser)

 var isdisableOn

 if(admin != user){
   isdisableOn = true
 }

 else{
   isdisableOn = false
 }

   console.log(admin, 'Admin')

 
   return (
     <Fragment>

        <Button className="user-icon" disabled={isdisableOn} variant="primary ml-3 mb-3" onClick={getMembers} onMouseUp={() => showGroupModal(true)}>
         {isdisableOn? <p className='addmembers'>Only Admin Can Add Members</p>:''}
         <i class="fas fa-user-plus"></i>
       </Button>



       <Modal show={showModal} onHide={() => showGroupModal(false)} centered>
         <Modal.Header closeButton>
           <Modal.Title className='user-limit'>Add Users | Max User limit: {maxUser}
           <span className='fas fa-edit' onClick={()=>setEditUser(true)}></span>
           </Modal.Title>
           {/* <span className='fas fa-edit' onClick={this.showUserEditField}></span> */}
         </Modal.Header>

         <Modal.Body className="members">

         {editUser ?
         <div className>
           <label for="MaxMember">Enter Max Members: </label>
           <div className='save-button'>
           <div className = 'edit-user'>
           
              <input type="Number" name="MaxMember" required onChange={changeUserLimit} ></input>
              <button className='edit-user-limit-btn btn-primary'  onClick={()=>saveUserLimit(false)}  disabled={limit_disable}>Save</button>
              
           </div>
           </div>
         </div>
         : null }
         </Modal.Body>

         <Modal.Body >
           <AddUserModal user={user} handleChange={handleChange} list={list} error={error} show={show} ></AddUserModal>
         </Modal.Body>

         <Modal.Footer>
           <Button className='close-btn' variant="secondary" onClick={() => showGroupModal(false)}>
             Close
               </Button>
           <Button className='save-btn' variant="primary" onClick={saveMembers} disabled={isdisableSave}>
             Save
               </Button>
         </Modal.Footer>
       </Modal>
     </Fragment>
   )
 }
}
