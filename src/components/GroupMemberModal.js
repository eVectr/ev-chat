import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'

import '../styles/groupmembermodal.css'


const users = [
        
        {
            name:'Nitin'        
        },

        {
            name:'Prashant'        
        },

        {
            name:'Shubham'        
        },

        {
            name:'kripal'        
        },

        {
            name:'shivam'        
        }


]

class GroupMemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }



  render() {  
      
    const{getMembers} = this.props

    return (
      <div>
        <Button className= 'group-member' onClick={getMembers} onMouseUp={this.toggle}>View Group Members</Button>
        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
          toggle={this.toggle} className={this.props.className}>
           <ModalHeader toggle={this.toggle}>Group Name here</ModalHeader> 
          <ModalBody>
                <ul >
                    {
                        users.map((user, index) => {
                            

                            return(
                               <div className="group-list">
                                    <li className="group-user"> <span  className="fas fa-user-circle user-profile-photo icon"></span>{user.name}</li>
                                    <span className='far fa-trash-alt'></span>
                               </div> 
                            )
                            
                        })
                    }
                    
                </ul>  
          </ModalBody>
          <ModalFooter>
            <Button className='close-modal' color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default GroupMemberModal;