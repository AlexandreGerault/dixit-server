import dotenv from 'dotenv'
import express from 'express';

dotenv.config();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

io.on('connection', (socket: any) => {
  console.log('A new user connected');
});

const PORT = process.env.PORT || 3333;
http.listen(PORT, () => {
  console.log('Listening on *:' + PORT);
});

io.on('disconnect', () => console.log('A user has disconnected'));
