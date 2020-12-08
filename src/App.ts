import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import { Server, Socket } from 'socket.io';
import Http from 'http';
import { RoomService } from './classes/RoomService';
import { SocketClient } from './classes/SocketClient';

dotenv.config();
const PORT = process.env.PORT ?? 3333;
const ORIGIN = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const app = express();
const http = Http.createServer(app);
const io = new Server(http, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST'],
  },
});
const rs = new RoomService(io);
let clients: SocketClient[] = [];

app.use(express.static('public'));
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

io.on('connection', (socket: Socket) => {
  clients = [...clients, new SocketClient(socket, rs)];
  socket.on('disconnect', () => {
    clients = clients.filter((c) => c.socket !== socket);
  });
});
