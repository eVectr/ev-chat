import React, {Component} from 'react'
import {Button,Modal} from 'react-bootstrap'
import groups from '../constants/groups';






class CreateGroupModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state={
            show:false
        }
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
      }
    
      handleClose() {
        this.setState({ show:false });
      }
    
      handleShow() {
        this.setState({ show: true });
      }

      

    

   
     

    render(){
    
        const{setGroupName, groups, saveGroupName}=this.props 
               console.log(groups, 'group452343')
        return(
            <>
            <Button variant="primary ml-3 mb-3" onClick={this.handleShow}>
                Create Group
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
           <Modal.Header closeButton>
                <Modal.Title> Enter Group Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" name="groupname" onChange={setGroupName} value={groups}/>
             </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
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