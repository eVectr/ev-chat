import React, { useState, useEffect } from 'react'
import { authenticateUser } from '../utils/auth'
import loginValidation from '../utils/Validation'
import users from '../constants/users';



const Login = ({ history }) => {

    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState('')



    useEffect(() => {

        let getUser = JSON.parse(localStorage.getItem('user'))
        console.log(getUser, 'getUserss')
        let { user_id = '' } = getUser || {}
        
        if(user_id) {
            history.push('/chat')
        }
       
     },[])




    const handleChange = e => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value,
        })
        
    }


        

    const onSubmit = () => {
        

        const user = authenticateUser(data)
        

        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            history.push('/chat')
            
        }

        const errors =loginValidation(data)
        {
            console.log(errors, 'errors')
            setErrors(errors)
           return
       }
    }

    
    return (
        <div>
            <h1>Login</h1>
            <input name="username" type="text"  placeholder="Username" value={data.username} onChange={handleChange} />
            <p className='error-message-text'>{(errors.username && errors.username[0]) || ''}</p>
            <input name="password" type="password" placeholder='Password' value={data.password} onChange={handleChange} />
            <p className='error-message-text'>{(errors.password && errors.password[0]) || ''}</p>
            <button onClick={onSubmit} >Login</button>
        </div>
    )
}

export default Login
