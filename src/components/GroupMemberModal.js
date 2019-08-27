import React, {  Fragment  } from 'react'
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

    const{ getMembers, list, admin, user, deleteMember, exitGroup, deleteGroup } = this.props
   
    return (
      <div>
        <Button className= 'group-member' onClick={getMembers} onMouseUp={this.toggle}>View Group Members</Button>
        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
          toggle={this.toggle} className={this.props.className}>
           <ModalHeader toggle={this.toggle}>Group Members</ModalHeader> 
            
           
          <ModalBody>
          
                <ul >
                    {

                      list.map((user1, index) => {
                       
                          let showAdmin = user1
                          if (!index) {
                            showAdmin = `${showAdmin} ~admin`
                          }

                          let check =true
                          if (!index) {
                            check = false
                          }

                     
                          console.log("check ===list[0]",list[0]== user)
                         let isAdmin
                          if(list[0] == user){
                            isAdmin = true
                          }else{
                            isAdmin = false
                          }
                            return(
                               <div className="group-list">

                                {(isAdmin)?<Fragment>
                                    <li className="group-user"> <span  className="fas fa-user-circle user-profile-photo icon"></span>{showAdmin}</li>
                                     {check? <span className='far fa-trash-alt' onClick={()=>deleteMember(user1)} ></span>: ''}
                                 </Fragment>:
                                 <Fragment>
                                 <li className="group-user"> <span  className="fas fa-user-circle user-profile-photo icon"></span>{showAdmin}</li> 
                              </Fragment>
                                }

                           </div> 
                            )
                        
                            
                        })
                    }
                </ul>  

                {(admin == user)?<button type="button" className="btn btn-danger remove" onClick ={deleteGroup}> <i class="far fa-trash-alt"></i>Delete Group</button>
                :<button type="button" className="btn btn-danger remove" onClick ={()=>exitGroup(user)}> <i class="fas fa-sign-out-alt"></i>Exit Group</button>}

    
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

