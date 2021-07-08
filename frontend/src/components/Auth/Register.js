import React, { useState } from 'react'
import registerImage from '../../assets/images/register.svg'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'

import { useDispatch } from 'react-redux'
import { register } from '../../store/actions/auth'
import './Auth.scss'

const Register = () => {

    const dispatch = useDispatch()
    const history = useHistory()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState('male')

    const submitForm = (e) => {  
        e.preventDefault()

        dispatch(register({firstName, lastName, email, gender, password}, history))

    }

    return (
        <div id='auth-container'>
            <div id='auth-card'>
                <div className="card-shadow">
                    <div id='image-section'>
                        <img src={registerImage} alt="Register" />
                    </div>

                    <div id='form-section'>
                        <h2>Create an account</h2>

                        <form onSubmit={submitForm}>

                            <div className='input-field mb-1'>
                                <input 
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required='required'
                                    type='text'
                                    placeholder="First name" />
                            </div>

                            <div className='input-field mb-1'>
                                <input 
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required='required'
                                    type='text'
                                    placeholder="Last name" />
                            </div>

                            <div className='input-field mb-1'>
                                <input 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required='required'
                                    type='email'
                                    placeholder="Email" />
                            </div>

                            <div className="input-field mb-1">
                                <select
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                    required='required'
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="input-field mb-2">
                                <input 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required='required'
                                    type='password'
                                    placeholder="Password" />
                            </div>

                            <button>REGISTER</button>

                        </form>

                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
