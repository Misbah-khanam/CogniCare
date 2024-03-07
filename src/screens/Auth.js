import React from "react";
import './Auth.css'
import bg from './../assets/images/auth1.png'
import loginBg from './../assets/images/login.svg'
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Api";

const AuthScreen = () => {
    const [displayLogin, setDisplayLogin] = useState("block")
    const [displayRegister, setDisplayRegister] = useState("none")

    const [email, setEmail] = useState()
    const [fullName, setFullName] = useState()
    const [organisation, setOrganisation] = useState()
    const [password, setPassword] = useState()
    const [cpassword, setcpassword] = useState()
    const [phone, setPhone] = useState()

    const [username, setUsername] = useState()
    const [loginPassword, setloginPassword] = useState()
    const navigate = useNavigate()

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        api.post(
            'user/login/',{
                email: username,
                password: loginPassword
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            }
        ).then(response => {
            console.log(JSON.parse(response.data.user)[0].fields)
            localStorage.setItem("user",response.data.user)
            navigate('/home')
        }).catch(error => {
            console.log(error)
        })
        
    }

    const handleRegisterSubmit = (e) => {
        e.preventDefault()
        api.post(
            'user/signup/',{
                name:fullName,
                email:email,
                phone:phone,
                password:password,
                userType:'organisation',
                organisation:organisation
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            }
        ).then(response => {
            console.log(response.data)
            if(response.data.messages === 'user registered successfully'){
                window.location.reload()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const handleDisplayLogin =()=> {
        setDisplayLogin("block")
        setDisplayRegister("none")
    }

    const handleDisplayRegister = () => {
        setDisplayLogin("none")
        setDisplayRegister("block")
    }
    return(
        <div className="AuthPage">
            <div className="AuthCard">
                <div className="image-div">
                    <img className="shape-bg" src={bg}/>
                    <img className="login-bg" src={loginBg}/>
                </div>
                <div className="form-div">
                    <a className="form-header" href="/" style={{fontSize: "34px", paddingBottom: '8px', fontWeight: "900px"}}>CogniCare</a>
                    <h2 className="form-header">Welcome!</h2>
                    <center>
                    <div className="login-signup-btns">
                        <h4 onClick={handleDisplayLogin} className={displayLogin == "block" ? "selected-btn":""}>Login</h4>
                        <h4 onClick={handleDisplayRegister} className={displayRegister == "block" ? "selected-btn":""}>Signup</h4>
                    </div>
                    </center>
                    <div className="login-div" style={{display: displayLogin}}>
                        <form className="login-form" onSubmit={handleLoginSubmit}>
                            <MDBInput label='Username' id='username' type='text' size="lg" name="username" required onChange={(e)=> {setUsername(e.target.value)}}/>
                            <MDBInput label='Password' id='login_password' type='password' size="lg" name="password"  required onChange={(e) => {setloginPassword(e.target.value)}}/>
                            <p className="forgot-password">Forgot password ?</p>
                            <MDBBtn>Submit</MDBBtn>
                        </form>
                    </div>
                    <div className="signup-div" style={{display: displayRegister}}>
                        <form className="signup-form" onSubmit={handleRegisterSubmit}>
                            <MDBInput label='Full Name' id='fullname' type='text' onChange={(e) => {setFullName(e.target.value)}} required />
                            <MDBInput label='Email' id='email' type='email' onChange={(e) => {setEmail(e.target.value)}} required />
                            <MDBInput label='Phone Number' id='phone' type='text' onChange={(e) => {setPhone(e.target.value)}} required />
                            <MDBInput label='Organization' id='organization' type='text' onChange={(e) => {setOrganisation(e.target.value)}} required />
                            <MDBInput label='Password' id='password' type='password' onChange={(e) => {setPassword(e.target.value)}} required />
                            <MDBInput label='Confirm Password' id='confirmPassword' type='password' onChange={(e) => {setcpassword(e.target.value)}} required  />
                            <MDBBtn type="submit">Submit</MDBBtn>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthScreen