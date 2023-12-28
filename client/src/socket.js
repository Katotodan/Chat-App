import { io } from 'socket.io-client';

export const socket = io("http://localhost:5000", {
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
    },
    autoConnect: false
});