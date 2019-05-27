import React from 'react';
import { Alert } from 'reactstrap';

const SucessfullMessage = (props) => {
  return (
    <div style={{marginTop:"150px"}}>
      <Alert color="primary" > 
            Added Sucessfully
      </Alert>
    </div>
  );
};

export default SucessfullMessage;