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

  

  // deleteItems = (user)=> {    
  //  const removedItemUser = this.state.users.filter(item => item.name !== user.name)
  //   this.setState({
  //     users:removedItemUser
  //   })

  // }


  render() {  
    const{getMembers, list, deleteMember} = this.props

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
                            

                            return(
                               <div className="group-list">
                                    <li className="group-user"> <span  className="fas fa-user-circle user-profile-photo icon"></span>{user}</li>
                                    <span className='far fa-trash-alt' onClick={()=>deleteMember(user)} ></span>
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