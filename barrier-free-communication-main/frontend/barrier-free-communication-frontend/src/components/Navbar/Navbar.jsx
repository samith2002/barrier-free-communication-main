import React from 'react'
import './Navbar.css'
import logo from '../../assets/logoo.png'
import {LiaToggleOffSolid, LiaToggleOnSolid} from 'react-icons/lia'
import {NavLink} from 'react-router-dom'


const Navbar = ({theme, setTheme}) => {

    const toggle_mode = ()=>{
        theme == 'light' ? setTheme('dark') : setTheme('light')
    }

  return (
    <div className='navbar'>

        <img src={logo} alt="" className='logo'/>

        <ul>
            <li>
                <NavLink to='/'>Dashboard</NavLink>
            </li>
            <li>
                <NavLink to='/ui'>UI Customization</NavLink>
            </li>
            <li>
                <NavLink to='/VoiceCommand'>Voice Command Activation</NavLink>
            </li>
            <li>
                <NavLink to='/Help'>Help</NavLink>
            </li>
            <li>
                <NavLink to='/FAQs'>FAQs</NavLink>
            </li>
            
        </ul>

        <div>
            {theme == 'light' && <LiaToggleOffSolid className = 'toggle' onClick={()=>{toggle_mode()}}/>}
            {theme == 'dark' && <LiaToggleOnSolid className = 'toggle' onClick={()=>{toggle_mode()}}/>}
        </div>

    </div>
  )
}

export default Navbar