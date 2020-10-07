import React, { useState, useEffect, useCallback,useRef } from 'react';
import ChatRoom from '../components/ChatRoom';
import { getMessageThisChatroom,sendFile } from '../lib/message';
import { withRouter } from 'react-router-dom';

const ChatroomContainer = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [emoji, triggerEmoji] = useState(false);
  const inputRef = useRef(null); 
  const lastestMsgRef  = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.removeListener('newMessage'); // 제거 후 다시 붙인다
      socket.on('newMessage', (message) => {
        console.log('socket on new Message',message)
        const newMessages = [...messages, message];
        setMessages(newMessages);
        lastestMsgRef.current.scrollIntoView({behavior:'smooth'});
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

  useEffect(()=>{
    if(!emoji){
      inputRef.current.focus();
    }
  },[message,emoji ]);

  const setDefaultMessages = async () => {
    const response = await getMessageThisChatroom(chatroomId);
    console.log('----- chatroomId : ' + chatroomId);
    console.log('default Message', response);
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
    triggerEmoji(!emoji);
  };

  const onTriggerEmoji = (e)=>{
    e.preventDefault();
    triggerEmoji(!emoji);
  }

  const onDrop =(files)=>{
    console.log('file onDrop',files)
    const formData = new FormData();
    const config={
      header:{'content-type':'multipart/form-data'}
    }
    formData.append("file",files[0]);
    formData.append("username","sue")
    console.log('formdadta',formData.get("file"))
    
    setMessage(formData);

  }
  return ( 
    <ChatRoom
      messages={messages}
      onChange={onChange}
      onKeyPress={onKeyPress}
      sendMessage={sendMessage}
      message={message}
      onEmojiClick={onEmojiClick}
      onTriggerEmoji={onTriggerEmoji}
      emoji={emoji}
      inputRef={inputRef}
      lastestMsgRef={lastestMsgRef}
      onDrop={onDrop}
    />
  );
};

export default withRouter(ChatroomContainer);
