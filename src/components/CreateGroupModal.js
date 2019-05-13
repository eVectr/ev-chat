import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'

class CreateGroupModal extends Component {
  

  render() {
    
    
    const { setGroupNames, groupname, saveGroupName, hide, handleClose, handleShow} = this.props
    console.log(groupname, 'groupname')
    console.log(hide, 'hide')
    return (
      <Fragment>
        <Button className='create-btn' variant="primary ml-3 mb-3" onClick={handleShow} hide={hide}>
          Create Group
        </Button>
        <Modal show={hide} onHide={handleClose}>
          <Modal.Header closeButton show={hide} onClick={handleShow}>
            <Modal.Title> Enter Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Modal.Title> <input type="text" name="groupname" onChange={setGroupNames} value={groupname} /></Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" show={hide} onClick={handleClose} >
              Close
            </Button>
            <Button variant="primary" onClick={saveGroupName} show={hide} >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }
}

export default CreateGroupModal