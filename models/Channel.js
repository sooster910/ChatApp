const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: 'Channel name is required',
    },
    createBy: {
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
    // 체널 입장에서 초대한 사람을 알고있어야 할 필요가 있나?
    waitingUser: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        inviteDate: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    chatrooms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chatroom',
      },
    ],
  },
  { timestamps: true }, // 자동으로 createdAt과 updatedAt 생성
);

module.exports = mongoose.model('Channel', channelSchema);
