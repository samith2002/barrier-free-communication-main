// src/components/Youtube.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import captioningImage from '../assets/Captioning.png';
import jsPDF from 'jspdf';
import './Youtube.css';

function YouTubeCaptionGenerator({ theme }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [captions, setCaptions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState('txt');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCaptions('');
    setIsLoading(true);

    try {
      // Using the proxy configured in vite.config.js
      const response = await axios.post('http://127.0.0.1:5000/generate-captions', {
        youtube_url: youtubeUrl,
      });
      setCaptions(response.data.captions);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleSaveCaptions = () => {
    if (!captions) return;
    
    const header = "Barrier Free Communication - YouTube Captions\n" +
                  "===============================================\n" +
                  `Video URL: ${youtubeUrl}\n` +
                  `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    const contentWithHeader = header + captions;
    
    switch (fileType) {
      case 'txt':
        downloadTextFile(contentWithHeader);
        break;
      case 'pdf':
        downloadPdfFile(contentWithHeader);
        break;
      case 'docx':
        // In a real application, you'd use a library like docx.js
        // For this demo, we'll just show a message that docx is not supported
        alert('DOCX format support requires additional libraries. Downloading as TXT instead.');
        downloadTextFile(contentWithHeader);
        break;
      default:
        downloadTextFile(contentWithHeader);
    }
  };

  const downloadTextFile = (content) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "barrier-free-communication-captions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPdfFile = (content) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Barrier Free Communication - YouTube Captions", 20, 20);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Add video URL and date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Video URL: ${youtubeUrl}`, 20, 35);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 45);
    
    // Add captions with word wrapping
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(captions, 170);
    doc.text(splitText, 20, 60);
    
    // Save the PDF
    doc.save("barrier-free-communication-captions.pdf");
  };

  return (
    <div className={`youtube-container ${theme === 'dark' ? 'dark' : ''}`}>
      <h1 className="youtube-title">SOCIAL MEDIA CAPTIONING</h1>
      
      <div>
        <Stack direction="row" spacing={1} justifyContent="center" margin={2}>
          <Box sx={{ padding: 1, flex: 0.3 }}>
            <img 
              src={captioningImage} 
              alt="Captioning illustration" 
              style={{ height: "300px", width: "400px" }}
            />
          </Box>
          
          <Box sx={{ padding: 1, flex: 0.7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="youtube-form-container">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="youtube-url" className="youtube-label">
                  Provide the youtube url link here for which you need the caption
                </label>
                
                <input
                  id="youtube-url"
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="youtube-input"
                />
                
                <button 
                  type="submit" 
                  className="youtube-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Caption'}
                </button>
              </form>
            </div>
            
            {error && <p className="youtube-error">{error}</p>}
            
            {captions && (
              <div className="youtube-captions-container">
                <h2>Generated Captions:</h2>
                <div className="youtube-captions">
                  {captions}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="file-type-label">File Type</InputLabel>
                    <Select
                      labelId="file-type-label"
                      id="file-type-select"
                      value={fileType}
                      label="File Type"
                      onChange={handleFileTypeChange}
                      className={theme === 'dark' ? 'dark-select' : ''}
                    >
                      <MenuItem value="txt">TXT</MenuItem>
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="docx">DOCX</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <button 
                    onClick={handleSaveCaptions}
                    className="youtube-button"
                  >
                    Save Captions
                  </button>
                </div>
              </div>
            )}
          </Box>
        </Stack>
      </div>
    </div>
  );
}

export default YouTubeCaptionGenerator;
