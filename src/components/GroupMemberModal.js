import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'

import '../styles/groupmembermodal.css'



class GroupMemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }


  


  render() {  

    const{getMembers, list, user, deleteMember} = this.props
   
    return (
      <div>
        <Button className= 'group-member' onClick={getMembers} onMouseUp={this.toggle}>View Group Members</Button>
        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
          toggle={this.toggle} className={this.props.className}>
           <ModalHeader toggle={this.toggle}>Group Members</ModalHeader> 
          <ModalBody>
                <ul >
                    {
                      list.map((user, index) => {
                        
                          let showAdmin = user
                          if (!index) {
                            showAdmin = `${showAdmin} ~admin`
                          }
                          let check =true
                          if (!index) {
                            check = false
                          }
                            return(
                               <div className="group-list">
                                    <li className="group-user"> <span  className="fas fa-user-circle user-profile-photo icon"></span>{showAdmin}</li>
                            {check? <span className='far fa-trash-alt' onClick={()=>deleteMember(user)} ></span>: '' }
                               </div> 
                            )
                            
                        })
                    }
                </ul>  
          </ModalBody>
          <ModalFooter>
            <Button className='close-modal' color="secondary" onClick={this.toggle}>close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default GroupMemberModal;

//onClick={ () => this.deleteItems(user)}