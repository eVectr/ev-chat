import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = (props) => {
  return (
    <div>
      <Alert color="primary">
            You Cannot add more than 5 People
      </Alert>
    </div>
  );
};

export default ErrorMessage;