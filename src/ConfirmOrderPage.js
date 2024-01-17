// ConfirmOrderPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button } from '@mui/material';

const ConfirmOrderPage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/ordercomplete'); // Redirect to Order Complete page on confirmation
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Are you sure?</Typography>
        <Button variant="contained" color="primary" onClick={handleConfirm} fullWidth>
          Yes
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel} fullWidth style={{ marginTop: '10px' }}>
          No
        </Button>
      </Paper>
    </Container>
  );
};

export default ConfirmOrderPage;
