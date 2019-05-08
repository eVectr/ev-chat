<<<<<<< HEAD
import React, { useState, useEffect} from 'react'
=======
import React, { useState } from 'react'
>>>>>>> dev

import Select from 'react-select'
import { options } from '../constants'
import '../styles/groupbutton.css'



const AddUserModal = (props) => {
    return (
        <div className="adduser">
            <Select options={options} isMulti onChange={data => props.handleChange(data)} />

<<<<<<< HEAD
const AddUserModal = (props) => {

const [user, setUser] = useState([])   

let admin = props.user
let users = []

const options = [

    { value: 'Love', label: 'Love' },
    { value: 'Ajay', label: 'Ajay' },
    { value: 'Trivedi', label: 'Trivedi' },
    { value: 'Kripal', label: 'Kripal' },
    { value: 'Joshua', label: 'Joshua' },
    
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
            <div className = "adduser">
                <Select  options={users} isMulti/>
            </div>
        )
   
    }

  export default AddUserModal
 
=======
        </div>
    )

}

export default AddUserModal
>>>>>>> dev
