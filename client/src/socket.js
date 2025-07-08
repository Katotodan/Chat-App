import { io } from 'socket.io-client';
import mitt from 'mitt';

export const socket = io(process.env.REACT_APP_API_URL, {
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
    },
    autoConnect: false
});

export const emitter = mitt();
