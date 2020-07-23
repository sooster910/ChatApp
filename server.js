require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const port = 5000 || process.env.PORT;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// //Bring in the models 
require('./models/User');
require('./models/Chatroom');
require('./models/Message');



mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true  }).then(() => { 
     console.log('MongoDB connected')
    app.listen(port, () => console.log(`Server started on port ${port}`)) }
).catch(err => console.log('Mongoose connection ERROR', err.message));



