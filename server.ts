import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');
  let isSender = false;

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    if (message === 'I am the sender') {
      isSender = true;
      console.log('Client identified as the sender');
    } else if (message === 'I am the receiver') {
      console.log('Client identified as the receiver');
    } else {
      // If neither sender nor receiver, broadcast the message accordingly
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          if (isSender) {
            client.send(`Sender says: ${message}`);
          } else {
            client.send(`Receiver says: ${message}`);
          }
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT: number = parseInt(process.env.PORT!) || 3000;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
