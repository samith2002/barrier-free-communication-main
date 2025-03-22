import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import UICustomization from './components/UICustomization'
import VoiceCommand from './components/VoiceCommand'
import Help from './components/Help'
import FAQ from './components/FAQ'
import Dashboard from './components/Dashboard'
import {Route, Routes} from 'react-router-dom'
import ASL from './components/ASL'
import { Typography } from '@mui/material'
import YouTubeCaptionGenerator from './components/Youtube'

const App = () => {

  const [theme, setTheme] = useState('light');

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme}/>
      <Routes>
        <Route path='/' element={<Dashboard theme={theme} setTheme={setTheme}/>}/>
        <Route path='/ui' element={<UICustomization theme={theme} setTheme={setTheme}/>}/>
        <Route path='/voicecommand' element={<VoiceCommand theme={theme} setTheme={setTheme}/>}/>
        <Route path='/help' element={<Help theme={theme} setTheme={setTheme}/>}/>
        <Route path='/faqs' element={<FAQ theme={theme} setTheme={setTheme}/>}/>
        <Route path='/audioASL' element={<ASL theme={theme} setTheme={setTheme}/>}/>
        <Route path='/youtube' element={<YouTubeCaptionGenerator theme={theme} setTheme={setTheme}/>}/>
      </Routes>

      <div className='feedback'>
        {theme == 'light' &&
        <div className='analytics' >
            <h3 className='analytics-header'> Analytics </h3>
            <div className='analytics-numbers'>
              <div>
                <h4>View Count</h4>
                <h4 className='analytics-nn'>200</h4>
              </div>

              <div>
                <h4>Watch Time</h4>
                <h4 className='analytics-nn'>200</h4>
              </div>

              <div>
                <h4>Total Translation</h4>
                <h4 className='analytics-nn'>200</h4>
              </div>

            </div>
        </div>
        }

        {theme == 'dark' &&
        <div className='analytics-dark' >
            <h3 className='analytics-header' style={{color: 'white'}}> Analytics </h3>
            <div className='analytics-numbers'>
              <div>
                <h4 style={{color: 'white'}}>View Count</h4>
                <h4 className='analytics-nn' style={{color: 'white'}}>200</h4>
              </div>

              <div>
                <h4 style={{color: 'white'}}>Watch Time</h4>
                <h4 className='analytics-nn' style={{color: 'white'}}>200</h4>
              </div>

              <div>
                <h4 style={{color: 'white'}}>Total Translation</h4>
                <h4 className='analytics-nn' style={{color: 'white'}}>200</h4>
              </div>

            </div>
        </div>
        }


        {theme == 'light' && <h4 className='feedback-fb' style={{color: 'black'}}>Want to Provide feedback?</h4>}
        {theme == 'dark' && <h4 className='feedback-fb' style={{color: 'white'}}>Want to Provide feedback?</h4>}


        <h4 className='feedback-ch'> Click Here</h4>
      </div>
    </div>
  )
}

export default App