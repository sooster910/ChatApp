import React, { useEffect, useState } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { getChatroomList, createRoom } from '../lib/chatroom';
import ChatroomContainer from './ChatroomContainer';
import ChatRoomListContainer from './ChatRoomListContainer';
import styled from 'styled-components';

const DashBoardWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const ChatRoomWrapper = styled.div`
  position: relative;
  width: calc(100% - 230px);
  overflow-y: scroll;
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
    <DashBoardWrapper>
      {/* {match.path} */}
      <aside>
        {!chatroomList ? (
          <div>loading...</div>
        ) : (
          <ChatRoomListContainer
            chatroomList={chatroomList}
            onCreateRoom={onCreateRoom}
          />
        )}
      </aside>
      <ChatRoomWrapper>
        <Switch>
          <Route
            path={match.path}
            render={() => <div>채팅방에 입장해주세요</div>}
            exact
          />
          <Route
            path={`${match.path}/chatroom/:id`}
            render={() => <ChatroomContainer socket={socket} />}
            exact
          />
          <Route
            render={({ location }) => (
              <div>{location.pathname} 잘못된 경로</div>
            )}
          />
        </Switch>
      </ChatRoomWrapper>
    </DashBoardWrapper>
  );
};

export default withRouter(DashBoardContainer);
