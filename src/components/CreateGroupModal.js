import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'

class CreateGroupModal extends Component {

  render() {

    
    
    const { setGroupNames, groupname, saveGroupName, hide, handleClose, handleShow } = this.props
    console.log(groupname, 'groupname')
    return (
      <Fragment>
        <Button className='create-btn' variant="primary ml-3 mb-3" onClick={handleClose} hide={hide}>
          Create Group
        </Button>
        <Modal show={hide} onHide={handleClose}>
          <Modal.Header closeButton show={hide} onClick={handleShow}>
            <Modal.Title> Enter Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" name="groupname" onChange={setGroupNames} value={groupname} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" show={hide} onClick={handleShow} >
              Close
            </Button>
            <Button variant="primary" onClick={saveGroupName} >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }
}

export default CreateGroupModal