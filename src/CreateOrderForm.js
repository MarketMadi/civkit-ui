import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';

const CreateOrderForm = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const relayUrl = 'ws://localhost:7000'; // Replace with your Nostr relay URL
    const ws = new WebSocket(relayUrl);

    ws.onopen = () => {
      console.log('Connected to Nostr relay');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleTestSubmit = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const testMessage = { message: 'Hello Nostr' };
      socket.send(JSON.stringify(testMessage));
      console.log('Test JSON message sent');
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Button variant="contained" onClick={handleTestSubmit} sx={{ mt: 3, mb: 2 }}>
        Send Test Message
      </Button>
    </Container>
  );
};

export default CreateOrderForm;


// import React, { useState, useEffect } from 'react';
// import { Container, Paper, Table, TableBody, TableCell, TableRow, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { v4 as uuidv4 } from 'uuid'; // For generating a unique event ID

// const CreateOrderForm = ({ onCreateOrder }) => {
//   const [newOrder, setNewOrder] = useState({
//     amount: '',
//     currency: '',
//     paymentMethod: '',
//     timer: '',
//     price: '',
//     bond: '',
//     premium: '',
//     orderType: 'Buy',
//   });

//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const relayUrl = 'ws://localhost:7000'; // Replace with your Nostr relay URL
//     const ws = new WebSocket(relayUrl);

//     ws.onopen = () => {
//       console.log('Connected to Nostr relay');
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);



//   const handleChange = (e) => {
//     setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       const timestamp = Math.floor(Date.now() / 1000);
//       const nostrEvent = {
//         id: uuidv4(), // Unique event ID
//         pubkey: 'your_public_key', // Replace with the actual public key
//         created_at: timestamp,
//         kind: 1, // Event kind (1 for text note, adjust as needed)
//         tags: [], // Add any relevant tags
//         content: JSON.stringify(newOrder),
//       };

//       socket.send(JSON.stringify(['EVENT', nostrEvent]));
//       console.log('Order event sent');
//     } else {
//       console.error('WebSocket is not connected');
//     }

//     onCreateOrder(newOrder);
//     setNewOrder({
//       amount: '',
//       currency: '',
//       paymentMethod: '',
//       timer: '',
//       price: '',
//       bond: '',
//       premium: '',
//       orderType: 'Buy',
//     });
//   };


//   return (
//     <Container component="main" maxWidth="sm">
//       <Paper sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
//         <Table component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TableBody>
//             {/* Amount */}
//             <TableRow>
//               <TableCell>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Amount"
//                   name="amount"
//                   value={newOrder.amount}
//                   onChange={handleChange}
//                 />
//               </TableCell>
//             </TableRow>
//             {/* ... other form fields ... */}
//             {/* Submit Button */}
//             <TableRow>
//               <TableCell>
//                 <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//                   Create Order
//                 </Button>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default CreateOrderForm;
