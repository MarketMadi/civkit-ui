// LockBondPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';

const LockBondPage = ({ orderDetails }) => {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    // Logic to handle the hold invoice confirmation
    // After confirmation, navigate to the Invoice Submission Page
    navigate('/submitinvoice');
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h5">Lock Bond</Typography>
        {/* Display QR Code here */}
        <Typography sx={{ mt: 2 }}>Your bond amount is locked in your wallet.</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenChat} sx={{ mt: 2 }}>
          Proceed to Invoice Submission
        </Button>
      </Paper>
    </Box>
  );
};

export default LockBondPage;
