require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const jwtMiddleware = require('./lib/jwtMiddleware');
const moment = require('moment');

// const port = process.env.PORT || process.env.TEST_PORT;
const port = process.env.TEST_PORT;


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwtMiddleware);

// Setup Cros Origin
// 다른 포트로 접근 시 cors오류가 발생해 추가해둠
app.use(
  require('cors')({
    origin: true,
    credentials: true,
  }),
);

// Bring in the models
require('./models/User');
require('./models/Chatroom');
require('./models/Message');

const userRouter = require('./routes/user');
const chatroomRouter = require('./routes/chatroom');
const messageRouter = require('./routes/message');
const dialogflowRouter = require('./routes/dialogflow');
const uploadRouter = require('./routes/upload');

// Route
app.use('/user', userRouter);
app.use('/chatroom', chatroomRouter);
app.use('/message', messageRouter);


mongoose
  //   .connect(process.env.DB_URI, {
  .connect(process.env.DB_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log('Mongoose connection ERROR', err.message));

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`),
);

// Socket.io
const io = socketio(server);

const jwt = require('jsonwebtoken');

const Message = mongoose.model('Message');
const User = mongoose.model('User');

io.use(async (socket, next) => {
  try {
    // 토큰 관리
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    socket.userData = payload;
    return next();
  } catch (err) {}
});

io.use(async (socket, next) => {
  if (socket.request.headers.cookie) {
    console.log(socket.request.headers.cookie);
    return next();
  }
  return next(new Error('Authentication error'));
});

io.on('connection', (socket) => {
  socket.use(async (packet, next) => {
    // connection 이후 User의 모든 request에 대해 lastReqTime 갱신하는 middleware
    User.findOneAndUpdate(
      socket.userData._id,
      {
        lastReqTime: Date.now(),
      },
      { new: true },
    ).exec();
    console.log(socket.userData._id + ' : update');
    return next();
  });

  console.log('Connected: ' + socket.userData._id);
  console.log(
    'userName : ' + socket.userData.firstname + ' ' + socket.userData.lastname,
  );

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userData._id);
  });

  socket.on('joinRoom', ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log(
      `[JOIN] user: ${socket.userData._id} joined chatroom: ${chatroomId}`,
    );
  });


  socket.on('leaveRoom', ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log(
      `[LEAVE] user: ${socket.userData._id} leaved chatroom: ${chatroomId}`,
    );
  });

  socket.on('chatroomMessage', async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userData._id });

      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userData._id,
        message: message,
      });

      io.to(chatroomId).emit('newMessage', {
        message,
        name: `${user.firstname} ${user.lastname}`,
        userId: socket.userData._id,
        createdAt: moment(new Date()).format('YYYY MM DD hh:mm:ss'),
      });

      await newMessage.save();
    }
  });
});

