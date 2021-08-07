const SEND_MESSAGE = 'send-message';
const MESSAGE_RECEIVED = 'message-received';
const NEW_USER = 'new-user';
const USER_LEFT = 'user-left';
const JOIN_ROOM = 'join-room';
const LEFT_ROOM = 'left-room';

const { instrument } = require('@socket.io/admin-ui');
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

const users = [];

io.on('connection', (socket) => {
  let { userId, userName } = socket.handshake.query;
  users.push({ userId, userName });

  socket.on(SEND_MESSAGE, ({ senderId, senderName, text, roomId }) => {
    socket.to(roomId).emit(MESSAGE_RECEIVED, { senderId, senderName, text });
  });

  socket.on(JOIN_ROOM, (roomId, name) => {
    userName = name
    socket.join(roomId);

    socket.to(roomId).emit(NEW_USER, userName, userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit(USER_LEFT, userName, userId);
    });
  });

  socket.on(LEFT_ROOM, (roomId) => {
    socket.join(roomId);

    socket.to(roomId).emit(USER_LEFT, userName, userId);
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(5000);
