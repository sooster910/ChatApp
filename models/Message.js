const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chatroom: {
    type: Schema.Types.ObjectId,
    required: 'chatroom is required',
    ref: 'Chatroom',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: 'user is required',
    ref: 'User',
  },
  message: {
    type: String,
    required: 'Message is required',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
