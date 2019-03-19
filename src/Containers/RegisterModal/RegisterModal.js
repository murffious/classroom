import React, { Component } from 'react'
import './registerModal.scss'
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser} from './../../ducks/reducer';
import {withRouter} from 'react-router-dom'

class RegisterModal extends Component {
    state = {
        firstName: '',
        lastName: '',
        email:'',
        username: '',
        password: '',
        isTeacher: null,
        errMessage: []
    }

    handleChange = (e) => {
        let { name, value } = e.target
        this.setState({[name]: value})
    }

    handleClick = async() => {
        const { firstName, lastName, email, username, password, isTeacher } = this.state
        const newUser = { firstName, lastName, email, username, password, isTeacher } 

        const emailValidator = email.match(/^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm)

        let errMessage = []
        if(isTeacher === null){
            errMessage.push('*Please choose between Student and Teacher option')
        }
        if(emailValidator === null){
            console.log('hit')
            errMessage.push('*Invalid Email Address')
        }
        
        if(errMessage.length!==0){
            this.setState({errMessage})
            return
        }

        // axios.post(`/auth/register`, newUser)
        //     .then(res => console.log(res.data))
        try{
            const regRes = await axios.post(`/auth/register`,newUser)        
            console.log(regRes.data)
            const updateUser = await this.props.updateUser(regRes.data)
            this.props.history.push('/dashboard')
        }
        catch(err){
            this.setState({errMessage:err.response.data})
        }
    }

    render() {
        // console.log(this.state)

        const errMapper = this.state.errMessage.map((err)=><p>{err}</p>)

        return (
            <div className='outer-reg'>
                <div className='inner-reg'>
                    <div className='left-modal-reg'>
                        <span className='login-left-title-reg'>A world class education for anyone, anywhere. 100% free.
                        </span>
                        <br/>
                        <br/>
                        <span className='login-left-subtitle-reg'>Join Khan Academy to get personalized help with what you’re studying or to learn something completely new. We’ll save all of your progress. By signing up for Khan Academy, you agree to our Terms of use and Privacy Policy.</span>
                    </div>
                    <div className='right-modal-reg'>
                        <span style={{color: 'red'}}>{errMapper}</span>
                        {console.log(this.state.errMessage)}
                        <br/>
                        <br/>
                        <span>First name:</span>
                        <br/>
                        <input type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange} />
                        <br/>
                        <span>Last name:</span>
                        <br/>
                        <input type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange}/>
                        <br/>
                        <span>Email:</span>
                        <br/>
                        <input type='text' name='email' value={this.state.email} onChange={this.handleChange}/>
                        <br/>
                        <span>Username:</span>
                        <br/>
                        <input type='text' name='username' value={this.state.username} onChange={this.handleChange}/>
                        <br/>
                        <span>Password:</span>
                        <br/>
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
                        <br/>
                        <br/>
                        <span>Join as a:</span>
                        <br/>
                        <button onClick={() => {this.setState({isTeacher: false})}}>Student</button>
                        <button onClick={() => {this.setState({isTeacher: true})}}>Teacher</button>
                        <br/>
                        <PrimaryButton onClick={this.handleClick}>Create Account</PrimaryButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(null,{updateUser})(RegisterModal))