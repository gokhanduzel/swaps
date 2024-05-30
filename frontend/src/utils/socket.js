import io from 'socket.io-client';
const socket = io('http://localhost:5001', {
    withCredentials: true,
    reconnection: true,  // Ensures the client will try to reconnect after losing connection
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket']  // Using WebSocket transport for better performance
});

socket.on('connect', () => {
    console.log('Connected to server via Socket.IO');
});

export default socket;
