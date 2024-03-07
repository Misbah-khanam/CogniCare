import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faTable,faLineChart} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  library.add(faUser,faTable,faLineChart)
  return (
    <div className='sidebar'>
      <NavLink to='/Home'>
        <div className='nav-item'>
          <FontAwesomeIcon icon={faUser}/>
          <span>Members List</span>
        </div>
      </NavLink>

      <NavLink to='/Records'>
        <div className='nav-item'>
          <FontAwesomeIcon icon={faTable}/>
          <span>Members Records</span>
        </div>
      </NavLink>

      <NavLink to='/Analytics'>
        <div className='nav-item'>
          <FontAwesomeIcon icon={faLineChart}/>
          <span>Analytics</span>
        </div>
      </NavLink>
    </div>
  )
}

export default Sidebar