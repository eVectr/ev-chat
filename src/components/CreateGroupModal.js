import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'
import '../styles/creategroupmodal.css'

class CreateGroupModal extends Component {
  
  render() {

    const { setGroupNames, groupname, saveGroupName, hide, handleClose, handleShow, load, } = this.props
    console.log(groupname, 'groupname')
    console.log(hide, 'hide')

    let isdisableSave = true 
    if (groupname) {
      isdisableSave = false
    }
    

    return (
      <Fragment>
        <Button className='create-btn button' variant="primary ml-3 mb-3" onClick={handleShow} hide={hide}>
          Create Group
        </Button>
        <Modal show={hide} onHide={handleClose} centered>
          <Modal.Header className="group-header" closeButton show={hide} onClick={handleClose}>
            <Modal.Title className='group-title'>Enter Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body className="groupname">
            <Modal.Title> 
              <input  type="text" name="groupname" onChange={setGroupNames} value={groupname} placeholder='Please Enter Group Name' />
            </Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button className="close-btn" variant="secondary" show={hide} onClick={handleClose} >
              Close
            </Button>
            <Button className="save-btn" variant="primary" onClick={saveGroupName} show={hide} disabled={isdisableSave} >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }
}

export default CreateGroupModal