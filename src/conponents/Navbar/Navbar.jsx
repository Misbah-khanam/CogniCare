import React, { useState } from "react";
import "../Navbar/Navbar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faSignOut, faBars} from "@fortawesome/free-solid-svg-icons";
import api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = () => {
    library.add(faUser, faSignOut, faBars)
    const navigate = useNavigate()

    const logout = (e) => {
        api.get(
            'user/logout/'
            ,{
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            }
        ).then(response => {
            console.log(response.data.message)
        }).catch(error => {
            console.log(error)
        })

        localStorage.clear()
        navigate("/")
        
    }


    return(
        <div>
            <div className="Navbar-main">
                <div className="navbar-div">
                    <div className="logo logo-navbar-main">
                        {/* <FontAwesomeIcon icon={faBars}/> */}
                        <h4>CogniCare</h4>
                    </div>
                    <div className="signOut">
                        <FontAwesomeIcon icon={faSignOut} onClick={() => {logout()}}/>
                    </div>
                </div>
            </div>
            <Sidebar/>
        </div>
    )
}

export default Navbar