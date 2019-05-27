import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'

import AddUserModal from '../components/AddUserModal'

import '../styles/groupmodal.css'
import '../styles/groupbutton.css'




export class GroupModal extends Component {

  render() {
    const { maxUser, showModal, saveMembers, admin, user, list, handleChange, setMaxUser, getMembers, error, show, showGroupModal, members } = this.props
    
    
    let isdisableSave = true 
    if (members.length) {
      isdisableSave = false
    }
    
    
    var isdisableOn 

    if(admin != user){
      isdisableOn = true
    }
    
    else{
      isdisableOn = false
    }
   

    return (
      <Fragment>

        <Button className="user-icon" disabled={isdisableOn} variant="primary ml-3 mb-3" onClick={getMembers} onMouseUp={() => showGroupModal(true)}>
          {isdisableOn? <p className='addmembers'>Only Admin Can Add Members</p>:''}
          <i class="fas fa-user-plus"></i>
        </Button> 
         
       <Modal show={showModal} onHide={() => showGroupModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Users | Max User limit: {maxUser}</Modal.Title>
          </Modal.Header>

          <Modal.Body className="members">
            <label for="MaxMember">Enter Max Members: </label>
            <input type="Number" name="MaxMember" onChange={setMaxUser} ></input>
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
