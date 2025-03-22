import React from 'react';
import { Box, Container, Stack, Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import { useState } from 'react';

const UICustomization = () => {
  const [selectedFont, setSelectedFont] = useState("Arial"); // Tracks Font Style
  const [selectedSize, setSelectedSize] = useState("14"); // Tracks Font Size
  const [selectedValue, setSelectedValue] = useState("a"); // Tracks Radio Selection
  
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleFontChange = (event) => setSelectedFont(event.target.value);
  const handleSizeChange = (event) => setSelectedSize(event.target.value);


  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>General UI Customization</h1>
      <Stack direction="row" spacing={3} justifyContent="center" margin={5}>
        <Box sx={{ border: 1, padding: 2, textAlign: "center", flex: 1 }}>
          <h3 style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px"  }}>Font Style</h3>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">Select Font Style</InputLabel>
            <Select
              sx = {{ width: 300}}
              id="demo-simple-select-autowidth"
              autoWidth
              label="FontStyle"
              value={selectedFont}
              onChange={handleFontChange}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Courier New">Courier New</MenuItem>
              <MenuItem value="Verdana">Verdana</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ border: 1, padding: 2, textAlign: "center", flex: 1 }}>
          <h3 style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px"  }}>Font Size</h3>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">Select Font Size</InputLabel>
            <Select
              sx = {{ width: 300}}
              id="demo-simple-select-autowidth"
              autoWidth
              label="FontSize"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="14">14</MenuItem>
              <MenuItem value="16">16</MenuItem>
              <MenuItem value="18">18</MenuItem>
              <MenuItem value="20">20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ border: 1, padding: 2, textAlign: "center", flex: 1 }}>
          <h3 style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px"  }}>Button & Icon Size</h3>
          <Radio {...controlProps('a')} size="small" />
          <Radio {...controlProps('b')} />
          <Radio
            {...controlProps('c')}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 28,
              },
            }}
          />
        </Box>

        <Box sx={{ border: 1, padding: 2, textAlign: "center", flex: 1 }}>
          <h3 style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px"  }}>Dark/Light Mode</h3>
          <Typography>Switch to enable dark/light mode is placed on the top right corner</Typography>
        </Box>
      </Stack>
    </div>
  )
}

export default UICustomization;