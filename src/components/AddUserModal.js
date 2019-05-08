import React, { useState, useEffect} from 'react'

import Select from 'react-select'
import '../styles/groupbutton.css'




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
 