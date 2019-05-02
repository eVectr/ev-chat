import React, { Component } from 'react'

import Select from 'react-select'
import '../styles/groupbutton.css'


///console.log(props.user)
const options = [
    { value: 'Love', label: 'Love' },
    { value: 'Ajay', label: 'Ajay' },
    { value: 'Trivedi', label: 'Trivedi' },
    { value: 'Kripal', label: 'Kripal' },
    { value: 'Joshua', label: 'Joshua' },
  ]
  
    const AddUserModal = (props) => (
    
    <div className = "adduser">
     <Select  options={options} isMulti/>
     </div>
   
  )

  export default AddUserModal
 