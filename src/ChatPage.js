import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, List, ListItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ChatPage = ({ onConfirmOrder }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
  
    const sendMessage = () => {
      if (message) {
        setChat([...chat, message]);
        setMessage('');
      }
    };
  
    const handleConfirmOrder = () => {
      navigate('/confirmorder');
    };
  
  return (
    <Container component="main" maxWidth="md">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Chat with Peer</Typography>
        <List>
          {chat.map((msg, index) => (
            <React.Fragment key={index}>
              <ListItem>{msg}</ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
          Send Message
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConfirmOrder} fullWidth style={{ marginTop: '20px' }}>
          Confirm Order
        </Button>
      </Paper>
    </Container>
  );
};

export default ChatPage;
