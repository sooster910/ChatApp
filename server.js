require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const dialogflowRouter = require('./routes/dialogflow');
const port = 5000 || process.env.PORT;
const socketio = require('socket.io');


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user',userRouter);
app.use('/dialogflow', dialogflowRouter);




mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true  }).then(() => { 
     console.log('MongoDB connected')
     }
).catch(err => console.log('Mongoose connection ERROR', err.message));

const server= app.listen(port, () => console.log(`Server started on port ${port}`))
//setup socketio
let io = socketio(server);

//listen socket connection not responding unless get a request from frontend
io.on('connection',(socket)=>{
    console.log('socketio connected');
    socket.on('disconnect',()=>{
        console.log(' socketio disconnected, User had left !')
    })

    socket.on('chat',(message)=>{
        console.log('chat on ',message)
        io.sockets.emit('chat', message)

    })
})
