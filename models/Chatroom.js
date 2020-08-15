const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchema = new Schema(
  {
    name: {
      type: String,
      required: 'name is required',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    member: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        lastAccessAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }, // 자동으로 createdAt과 updatedAt 생성
);

module.exports = mongoose.model('Chatroom', chatroomSchema);
