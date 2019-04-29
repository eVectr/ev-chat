import React, { Component } from 'react'

import Select from 'react-select'
import '../styles/groupbutton.css'


///console.log(props.user)
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
  ]
  
  export const GroupModal = (props) => (
    
    <div className = "adduser">
     <Select  options={options} isMulti/>
     </div>
   
  )