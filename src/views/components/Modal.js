import React from "react"
import Modal from 'react-bootstrap/Modal'
import '../styles/groupbutton.css'
import '../styles/modal.css'
import { GroupModal } from "./GroupModal";


export class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  

  render() {
    return (
      <>

        <button className="groupbtn ml-3" variant="primary" onClick={this.handleShow}>
          Create Group
          </button>

        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Add Group Members
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GroupModal />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

