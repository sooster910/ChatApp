import React, { useEffect, useState } from 'react';
import { getChatroomList, createRoom } from '../lib/chatroom';
import DashBoard from '../Components/DashBoard';
import styled from 'styled-components';
import { withRouter, Route, Switch } from 'react-router-dom';
import ChatroomContainer from './ChatroomContainer';

const WrapperDiv = styled.div`
  display: flex;
`;

const ChatRoomDiv = styled.div`
  height: 700px;
  width: 300px;
  background: rgba(0, 0, 0, 0.2);
  overflow: scroll;
`;

const DashBoardContainer = ({ match, socket }) => {
  const [chatroomList, setChatroomList] = useState();

  useEffect(() => {
    // set Chatroom
    getChatrooms();
  }, []);

  const getChatrooms = async () => {
    const response = await getChatroomList();
    setChatroomList(response);
  };

  const onCreateRoom = async (roomName) => {
    const response = await createRoom(roomName);

    if (typeof response === 'string') {
      return false;
    } else {
      getChatrooms(); // chatroom 새로고침
      return true;
    }
  };

  return (
    <WrapperDiv>
      {match.path}
      <div>
        {!chatroomList ? (
          <div>loading...</div>
        ) : (
          <DashBoard chatroomList={chatroomList} onCreateRoom={onCreateRoom} />
        )}
      </div>
      <ChatRoomDiv>
        <Switch>
          <Route
            path={match.path}
            render={() => <div>채팅방에 입장해주세요</div>}
            exact
          />
          <Route
            path={`${match.path}/chatroom/:id`}
            render={() => <ChatroomContainer socket={socket} />}
          />
          <Route
            render={({ location }) => (
              <div>{location.pathname} 잘못된 경로</div>
            )}
          />
        </Switch>
      </ChatRoomDiv>
    </WrapperDiv>
  );
};

export default withRouter(DashBoardContainer);
