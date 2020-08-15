import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, Route } from 'react-router-dom';
import { getChatroomsList, createRoom } from '../lib/chatroom';
import { logout } from '../lib/user';
import ChatRoomPage from './ChatRoomPage';
import styled from 'styled-components';

const WrapperDiv = styled.div`
  display: flex;
  width: 100%;
`;

const RoomList = styled.div``;
const ChatRoom = styled.div`
  width: 300px;
  height: 500px;
  background: rgba(0, 0, 0, 0.3);
  overflow: scroll;
`;

const DashBoardPage = (props) => {
  console.log('asda');
  const [chatrooms, setChatrooms] = React.useState([]);

  const roomRef = createRef();

  const getChatrooms = async () => {
    const chatRoomList = await getChatroomsList();
    setChatrooms(chatRoomList);
  };

  const handleCreateRoom = () => {
    const name = roomRef.current.value;
    createRoom(name);
    getChatrooms();
  };

  const handleLogout = async () => {
    const result = await logout();
    props.socket.emit('disconnect');
    console.log(result);
    props.history.push('/');
  };

  React.useEffect(() => {
    getChatrooms();
  }, []);

  return (
    <WrapperDiv>
      <RoomList>
        <label>Room Name</label>
        <input name="roomname" ref={roomRef} />
        <button onClick={handleCreateRoom}>Create Room</button>
        {chatrooms === undefined || chatrooms === null ? (
          <div>no ChatRoom</div>
        ) : (
          chatrooms.map((chatroom) => (
            <div key={chatroom._id} className="chatroom">
              <dir>{chatroom.name}</dir>
              <Link to={`/chatroom/${chatroom._id}`}>
                <div>Join</div>
              </Link>
            </div>
          ))
        )}
        <button onClick={handleLogout}>로그아웃</button>
      </RoomList>
      <ChatRoom>
        <Route
          path="/chatroom"
          render={() => <div>채팅방에 입장해주세요</div>}
          exact
        />
        <Route
          path="/chatroom/:id"
          render={() => <ChatRoomPage socket={props.socket} />}
        />
      </ChatRoom>
    </WrapperDiv>
  );
};

export default withRouter(DashBoardPage);
