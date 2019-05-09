import React, { useState } from 'react'

import Select from 'react-select'
import { options } from '../constants'
import '../styles/groupbutton.css'



const AddUserModal = (props) => {
   return (
       <div className="adduser">
           <Select options={options} isMulti onChange={data => props.handleChange(data)} />

       </div>
   )

}

export default AddUserModal