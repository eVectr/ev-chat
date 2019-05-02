import React, {Component} from 'react'
import {Button,Modal} from 'react-bootstrap'
import groups from '../constants/groups';






class CreateGroupModal extends Component {
    // constructor(props, context) {
    //     super(props, context);

    //     this.state={
    //         show:false
    //     }
    
    //     this.handleShow = this.handleShow.bind(this);
    //     this.handleClose = this.handleClose.bind(this);
    //   }
    
    //   handleClose() {
    //     this.setState({ show:false });
    //   }
    
     

    

   
     

    render(){
        const{setGroupName, groups, saveGroupName, hide, handleClose, handleShow}=this.props 
        
        return(
            <>
            <Button variant="primary ml-3 mb-3" onClick={handleClose} hide={hide}>
                Create Group
            </Button>

            <Modal show={hide} onHide={handleClose}>
           <Modal.Header closeButton show={hide} onClick={handleShow}>
                <Modal.Title> Enter Group Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" name="groupname" onChange={setGroupName} value={groups}/>
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
      </>
        )
    }
}
export default CreateGroupModal