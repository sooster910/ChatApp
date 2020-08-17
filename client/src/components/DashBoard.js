import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

const DashBoard = ({ match, chatroomList, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    const createResponse = await onCreateRoom(roomName);
    if (createResponse) {
      setRoomName('');
    }
  };

  const onChange = (e) => {
    setRoomName(e.target.value);
  };

  // const logout
  return (
    <div>
      <label>room name</label>
      <input name="roomname" value={roomName} onChange={onChange} />
      <button onClick={handleCreateRoom}>CreateRoom</button>
      {chatroomList === undefined || chatroomList === null ? (
        <div> no Chat Room!</div>
      ) : (
        chatroomList.map((chatroom) => (
          <div key={chatroom._id}>
            <div>{chatroom.name}</div>
            <Link to={`${match.url}/chatroom/${chatroom._id}`}>
              {match.path}/chatroom/{chatroom._id} to Join Room
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default withRouter(DashBoard);
