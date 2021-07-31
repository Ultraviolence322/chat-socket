const SEND_MESSAGE = 'send-message';
const MESSAGE_RECEIVED = 'message-received';
const CLOSE_SOCKET = 'close-socket';
const NEW_USER = 'new-user';
const USER_LEFT = 'user-left';

const { instrument } = require('@socket.io/admin-ui');
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

  socket.broadcast.emit(NEW_USER, name, userId);

  socket.on('disconnect', () => {
    socket.broadcast.emit(USER_LEFT, name, userId);
  });

  socket.on(SEND_MESSAGE, ({ senderId, senderName, text }) => {
    socket.broadcast.emit(MESSAGE_RECEIVED, { senderId, senderName, text });
  });

  socket.on(CLOSE_SOCKET, (userName) => {
    const text = `${userName} leave the chat`;
    socket.broadcast.emit(MESSAGE_RECEIVED, {
      senderId: userId,
      senderName: null,
      text,
    });
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(5000);
