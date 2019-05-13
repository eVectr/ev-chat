import React, {Component} from 'react'
import {Button,Modal} from 'react-bootstrap'
import groups from '../constants/groups';

import Select from 'react-select'
import '../styles/groupbutton.css'

import AddUserModal from '../components/AddUserModal'




export class GroupModal extends Component {
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
        this.setState({
          show: true
        });
        
      }

    render(){
    
      
      const { saveMembers, user, handleChange, setMaxUser} = this.props
        return(
            <>
           

            <Button variant="primary ml-3 mb-3" onClick={this.handleShow}>
            <i class="fas fa-user-plus"></i>
            </Button>


         
           <Modal show={this.state.show} onHide={this.handleClose}>
           <Modal.Header closeButton>
                <Modal.Title>Add Users</Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <label for="MaxMember">Enter Max Members: </label>
                <input type ="Number"  name = "MaxMember"   onChange={setMaxUser} ></input>
             </Modal.Body>

             <Modal.Body>
                <AddUserModal user ={user} handleChange={handleChange}></AddUserModal>
             </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                Close
                </Button>
                <Button variant="primary" onClick={saveMembers} >
                Save
                </Button>
            </Modal.Footer>
            </Modal> 

      </>
        )
    }
}
