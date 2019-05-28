import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import is from 'is_js'

import { authenticateUser } from '../utils/auth'
import loginValidation from '../utils/Validation'

import '../styles/login.css'
import { sucessfullLogin } from '../redux/actions/auth';

const Login = (props) => {

    const [data, setData] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState('')

    useEffect(() => {

        let getUser = JSON.parse(localStorage.getItem('user'))
        console.log(getUser, 'getUserss')
        let { user_id = '' } = getUser || {}

        if (user_id) {
            props.history.push('/chat')
        }

    }, [])

    const handleChange = e => {
        const { name, value } = e.target

        setData({
            ...data,
            [name]: value,
        })
    }

    const onSubmit = () => {

        const [user, errorMsg] = authenticateUser(data)
        const errors = loginValidation(data)
        console.log(errors, 'Errors')
        console.log(errorMsg, 'errors')

        if (!is.empty(errors)) {
            setErrors(errors)
            return
        }

        if (errorMsg) {
            setErrors({
                credentialsError: [errorMsg]
            })
            return
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            console.log("item settted")
            props.dispatch(sucessfullLogin("Login Sucessfully"))
            props.history.push('/chat')
        }
    }

    return (
        <div className="p2p-login">
            <div className="login-form">
                <div className="user-info">
                    <h4 className='form-title'>P2P Login Form</h4>
                    <input name="username" type="text" placeholder="Username" value={data.username} onChange={handleChange} />
                    <p className='error-message-text'>{(errors.username && errors.username[0]) || ''}</p>
                    <input name="password" type="password" placeholder='Password' value={data.password} onChange={handleChange} />
                    <p className='error-message-text'>{(errors.password && errors.password[0]) || ''}</p>
                    <button onClick={onSubmit} >Login</button>
                    <p className='error-message-text'>{(errors.credentialsError && errors.credentialsError[0]) || ''}</p>
                </div>
            </div>

        </div>
    )
}

export default connect(state => state)(Login)