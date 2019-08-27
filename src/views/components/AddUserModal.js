import React, { useState } from 'react'

import Select from 'react-select'
import '../styles/groupbutton.css'




const AddUserModal = (props) => {


    let admin = props.user
    let users = []
    
    let { list, error} = props

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



      let filteredSameMembers = users.filter(
          user => !list.find(member => member == user.value)
      )
       
    return (
        <div className="adduser">
            <Select options={filteredSameMembers} isMulti onChange={data => props.handleChange(data)} />
            {error ? <p>Max limit Reached</p> : null}
        </div>
    )

}

export default AddUserModal
