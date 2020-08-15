import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const ChannelPage = ({
  chatrooms,
  onCreateRoom,
  onLogout,
  onSelectChatroom,
}) => {
  const [roomName, setRoomName] = useState('');

  const onChangeInput = (e) => {
    setRoomName(e.target.value);
  };

  const handleCreateRoom = async () => {
    const result = await onCreateRoom(roomName);
    // true or false
    if (result) {
      setRoomName('');
    } else {
      // error 처리
    }
  };

  const handleSelectChatroom = (chatroom) => {
    onSelectChatroom(chatroom);
  };

  return (
    <div>
      <label>Room Name</label>
      <input name="roomname" value={roomName} onChange={onChangeInput} />
      <button onClick={handleCreateRoom}>Create Room</button>
      {chatrooms === undefined || chatrooms === null ? (
        <div> no Chat Room! </div>
      ) : (
        chatrooms.map((chatroom) => (
          <div key={chatroom._id}>
            <div>{chatroom.name}</div>
            <Link
              to={`/main/chatroom/${chatroom._id}`}
              onClick={() => handleSelectChatroom(chatroom)}
            >
              <div>JoinRoom!</div>
            </Link>
          </div>
        ))
      )}
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
};

export default ChannelPage;
