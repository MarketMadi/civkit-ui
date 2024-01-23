import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Paper, TextField, Button, Typography, List, ListItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { schnorr, utils } from 'noble-secp256k1';
import { LoginContext } from './LoginContext'; // Import the LoginContext

const ChatPage = ({ onConfirmOrder }) => {
    const navigate = useNavigate();
    const { credentials } = useContext(LoginContext); // Use credentials from LoginContext
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:7000');
        wsRef.current.onopen = () => console.log('Connected to Nostr relay');
        wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
        return () => wsRef.current?.close();
    }, []);

    const byteArrayToHex = (byteArray) => {
        return Array.from(byteArray, byte => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    };

    const createNostrEvent = async (content, kind = 1) => {
        try {
            const eventContent = {
                pubkey: credentials.npub, // Use logged-in user's public key
                created_at: Math.floor(Date.now() / 1000),
                kind: kind,
                tags: [],
                content: JSON.stringify(content),
            };

            const serializedEvent = JSON.stringify([
                0,
                eventContent.pubkey,
                eventContent.created_at,
                eventContent.kind,
                eventContent.tags,
                eventContent.content,
            ]);

            const messageHash = await utils.sha256(new TextEncoder().encode(serializedEvent));
            const signature = await schnorr.sign(messageHash, credentials.nsec); // Use logged-in user's private key

            return {
                ...eventContent,
                id: byteArrayToHex(await utils.sha256(new TextEncoder().encode(serializedEvent))),
                sig: byteArrayToHex(signature),
            };
        } catch (error) {
            console.error('Error creating Nostr event:', error);
            throw error;
        }
    };

    const sendMessage = async () => {
        if (message) {
            try {
                const nostrEvent = await createNostrEvent(message);
                const nostrMessage = JSON.stringify(['EVENT', nostrEvent]);
                wsRef.current.send(nostrMessage);
                setChat([...chat, message]);
                setMessage('');
            } catch (error) {
                console.error('Error sending chat message:', error);
            }
        }
    };

    const handleConfirmOrder = async () => {
        try {
            const confirmOrderMessage = 'Order confirmed';
            const nostrEvent = await createNostrEvent(confirmOrderMessage, 2); // Custom kind for order confirmation
            const nostrMessage = JSON.stringify(['EVENT', nostrEvent]);
            wsRef.current.send(nostrMessage);
            navigate('/confirmorder');
        } catch (error) {
            console.error('Error sending confirm order message:', error);
        }
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
