import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const Chatroompagee = ({
  match,
  socket,
  selectChatroom,
  importedMessages,
  setInitialStateChatroomId,
}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        console.log(message);
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
  }, [messages]);

  useEffect(() => {
    // 초기 시작페이지에 chatroomId가 들어오면 세팅해야함
    if (match.params.id) {
      console.log('id : ' + match.params.id);
      setInitialStateChatroomId(match.params.id);
    }
  }, []);

  return <div></div>;
};
export default withRouter(Chatroompagee);
