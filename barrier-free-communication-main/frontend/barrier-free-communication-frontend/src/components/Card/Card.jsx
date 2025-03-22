import React from 'react'
import {useNavigate} from 'react-router-dom'

import './Card.css'



const Card = ({theme, setTheme, text, image, buttonText, link}) => {
  const navigate = useNavigate()
  return (
    <div className="card">
        {theme == 'light' &&
        <div >
            <img src={image} alt="" className="card-image"></img>
            <p style={{color: 'black'}} className='card-title'>{text}
            </p>
            <button onClick={()=>navigate(`${link}`)} className='card-button'>{buttonText}</button>
        </div>}

        {theme == 'dark' &&
        <div >
            <img src={image} alt="" className="card-image"></img>
            <p style={{color: 'white'}} className='card-title'>{text}
            </p>
            <button onClick={()=>navigate(`${link}`)} className='card-button'>{buttonText}</button>
        </div>}

    </div>

  )
}

export default Card