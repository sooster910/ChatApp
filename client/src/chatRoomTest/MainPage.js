import React, { useEffect, useState, useCallback } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { getChatroomsList, createRoom, getChatroomData } from '../lib/chatroom';
import { getMessageThisChatroom } from '../lib/message';
import { logout } from '../lib/user';
import ChatRoomPage from './ChatroomPagee';
// import DashBoardPage from './DashBoardPage';
import ChannelPage from './ChannelPage';
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

const MainPage = ({ history, socket }) => {
  const [chatrooms, setChatrooms] = useState();
  const [selectChatroom, setSelectChatroom] = useState();
  const [importedMessages, setImportedMessages] = useState([]);

  const getChatroomList = async () => {
    const chatRoomList = await getChatroomsList();
    return await chatRoomList;
  };

  const onCreateRoom = async (roomName) => {
    const result = await createRoom(roomName);
    console.log(result);
    if (result.err) {
      console.log(result.err);
      return false;
    } else {
      // chatroom refresh
      setChatrooms(await getChatroomList());
      return true;
    }
  };

  const onLogout = async () => {
    await logout();
    socket.emit('disconnect');
    history.push('/');
  };

  const onSelectChatroom = (chatroom) => {
    setSelectChatroom(chatroom);
  };

  // 초기 로딩시 chatroom/:id가 있다면 그 값을 세팅해준다.
  const setInitialStateChatroomId = useCallback(
    () => async (chatroomId) => {
      const chatroomData = await getChatroomData(chatroomId);
      setSelectChatroom(chatroomData);
    },
    [],
  );

  // setting
  useEffect(() => {
    // setChatRoom
    if (!chatrooms) {
      (async () => {
        try {
          setChatrooms(await getChatroomList());
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, []);

  useEffect(() => {
    // setMessage
    if (selectChatroom) {
      (async () => {
        try {
          const defaultMessage = await getMessageThisChatroom(
            selectChatroom._id,
          );
          setImportedMessages(defaultMessage);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [selectChatroom]);

  return (
    <WrapperDiv>
      <RoomList>
        {!chatrooms ? (
          <div>loading...</div>
        ) : (
          <ChannelPage
            chatrooms={chatrooms}
            onCreateRoom={onCreateRoom}
            onLogout={onLogout}
            onSelectChatroom={onSelectChatroom}
          />
        )}
      </RoomList>
      <ChatRoom>
        {/* <Route path="/main/chatroom" render={() => <div> 채팅방 </div>} exact /> */}
        <Route
          path="/main/chatroom/:id"
          render={() => (
            <ChatRoomPage
              socket={socket}
              selectChatroom={selectChatroom}
              importedMessages={importedMessages}
              setInitialStateChatroomId={setInitialStateChatroomId}
            />
          )}
        />
      </ChatRoom>
    </WrapperDiv>
  );
};

export default withRouter(MainPage);
