import React, { useState } from 'react'

import Select from 'react-select'
import { options } from '../constants'
import '../styles/groupbutton.css'
import '../styles/addusermodal.css'



const AddUserModal = (props) => {


    let admin = props.user
    let users = []

    

    const options = [
        { value: 'Love', label: 'Love' },
        { value: 'Ajay', label: 'Ajay' },
        { value: 'Trivedi', label: 'Trivedi' },
        { value: 'Kripal', label: 'Kripal' },
        { value: 'Joshua', label: 'Joshua' },
        { value: 'Manoj', label: 'Manoj' },
        { value: 'Rajat', label: 'Rajat' },
      ]
    
      for(let i = 0; i< options.length; i++){
        if(options[i].value != admin){
              users.push(options[i])
        }
        else{
            continue
          }
        
      }

    return (
        <div className="adduser">
            <Select options={users} isMulti onChange={data => props.handleChange(data)} />

        </div>
    )

}

export default AddUserModal
