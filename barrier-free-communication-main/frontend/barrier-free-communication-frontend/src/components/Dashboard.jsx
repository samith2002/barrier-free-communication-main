import React from 'react'
import Card from './Card/Card'
import AudiotoASL from '../assets/AudiotoASL.png'
import ASLtoText from '../assets/ASLtoText.png'
import Captioning from '../assets/Captioning.png'
import './Dashboard.css'
import { Box, Container, Stack, Typography } from "@mui/material";

const Dashboard = ({theme, setTheme}) => {

  return (
    <div>
        <Stack direction="row" spacing={1} justifyContent="center" margin={1}>
          <Box sx={{ padding: 2, textAlign: "center", flex: 1 }}>
            <Card theme={theme} setTheme={setTheme} text={'Provide the audio input to view the ASL animation and to transcribe the audio into multiple languages.'} image={AudiotoASL} buttonText={'Audio to ASL'} link={'audioASL'}/>
          </Box>
          <Box sx={{ padding: 2, textAlign: "center", flex: 1 }}>
            <Card theme={theme} setTheme={setTheme} text={'Provide the American Sign Language video to view the text output and transcription to other languages.'} image={ASLtoText} buttonText={'ASL to Text'} link={'aslText'}/>
          </Box>
          <Box sx={{ padding: 2, textAlign: "center", flex: 1 }}>
            <Card theme={theme} setTheme={setTheme} text={'Provide the social media URL(Youtube) to view the suitable caption.'} image={Captioning} buttonText={'Captioning'} link={'youtube'}/>
          </Box>
        </Stack>
    </div>
    
  )
}

export default Dashboard