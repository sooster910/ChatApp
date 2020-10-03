import React, { useState, useEffect, useCallback } from 'react';
import ChatRoom from '../components/ChatRoom';
import { getMessageThisChatroom } from '../lib/message';
import { withRouter } from 'react-router-dom';

const ChatroomContainer = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
                                                                                                                                                                                                                                                                       
  useEffect(() => {
    if (socket) {
      socket.removeListener('newMessage'); // 제거 후 다시 붙인다
      socket.on('newMessage', (message) => {
        console.log(message);
        const newMessages = [...messages, message];
        setMessages(newMessages);

      });
    }
  }, [messages]);

  useEffect(() => {
    // set Default Message
    setDefaultMessages();

    // join Room
    if (socket) {
      socket.emit('joinRoom', {
        chatroomId,
      });
    }

    // Leave Room clean up
    return () => {
      if (socket) {
        socket.emit('leaveRoom', {
          chatroomId,
        });
      }
    };
  }, [chatroomId, socket]);

  const setDefaultMessages = async () => {
    const response = await getMessageThisChatroom(chatroomId);
    console.log('----- chatroomId : ' + chatroomId);
    console.log(response);
    if (response) {
      setMessages(response);
    }
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = useCallback(() => {
    console.log(message + 'Send!');
    if (socket) {
      socket.emit('chatroomMessage', {
        chatroomId,
        message: message,
      });
    }
    setMessage('');
  }, [message, chatroomId, socket]);

  const onKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13 || e.key === "Enter")
      sendMessage();
  }
  const onEmojiClick = (event, emojiObject) => {
    const newMessage = message + emojiObject.emoji
    setMessage(newMessage);
  };

  return ( 
    <ChatRoom
      messages={messages}
      onChange={onChange}
      onKeyPress={onKeyPress}
      sendMessage={sendMessage}
      message={message}
      onEmojiClick={onEmojiClick}
      
    />
  );
};

export default withRouter(ChatroomContainer);
