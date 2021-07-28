const SEND_MESSAGE = 'send-message';
const MESSAGE_RECEIVED = 'message-received';

const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

const users = [];

io.on('connection', (socket) => {
  const { userId, name } = socket.handshake.query;

  users.push({ userId, name });
  socket.on(SEND_MESSAGE, ({ senderId, senderName, text }) => {
    socket.broadcast.emit(MESSAGE_RECEIVED, { senderId, senderName, text });
  });
});

httpServer.listen(5000);
