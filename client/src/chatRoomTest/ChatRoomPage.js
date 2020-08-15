import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { getMessageThisChatroom } from '../lib/message';

const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState('');

  // useEffect(() => {
  //   console.log('messages!');
  //   console.log(messages);
  // }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      console.log(token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
      console.log(userId);
    }
  }, [messages]);

  if (socket) {
    socket.on('newMessage', (message) => {
      console.log(message);
      const newMessages = [...messages, message];
      setMessages(newMessages);
    });
  }

  useEffect(() => {
    // chatroom default message loading function
    const setDefaultMessages = async (chatroomId) => {
      const message = await getMessageThisChatroom(chatroomId);
      setMessages(message === undefined ? [] : message);
    };

    // join Room
    if (socket) {
      socket.emit('joinRoom', {
        chatroomId,
      });

      // set message
      setDefaultMessages(chatroomId);
    }

    // Leave Room clean up function
    return () => {
      if (socket) {
        socket.emit('leaveRoom', {
          chatroomId,
        });
      }
    };
  }, [chatroomId]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('chatroomMessage', {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = '';
    }
  };

  const info = () => {
    console.log(socket);
    console.log(chatroomId);
    console.log(messages);
  };

  // const setMessageThisChatroom = async (chatroomId) => {
  //   const defaultMessage = await getMessageThisChatroom(chatroomId);
  //   setMessages(defaultMessage === undefined ? [] : defaultMessage);
  // };

  // // chatroomId가 변경되면
  // React.useEffect(() => {
  //   setMessageThisChatroom(chatroomId);

  //   const token = localStorage.getItem('access_token');

  //   if (token) {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     setUserId(payload.id);
  //   }
  // }, [chatroomId]);

  // // messages가 변경될 때 마다
  // React.useEffect(() => {
  //   if (socket) {
  //     socket.on('newMessage', (message) => {
  //       console.log(message);
  //       const newMessages = [...messages, message];
  //       setMessages(newMessages);
  //     });
  //   }
  // }, [messages]);

  // const sendMessage = () => {
  //   if (socket) {
  //     socket.emit('chatroomMessage', {
  //       chatroomId,
  //       message: messageRef.current.value,
  //     });

  //     messageRef.current.value = '';
  //   }
  // };

  // React.useEffect(() => {
  //   if (socket) {
  //     socket.emit('joinRoom', {
  //       chatroomId,
  //     });
  //   }

  //   return () => {
  //     //Component Unmount
  //     if (socket) {
  //       socket.emit('leaveRoom', {
  //         chatroomId,
  //       });
  //     }
  //   };
  // }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? 'ownMessage' : 'otherMessage'
                }
              >
                {message.name}:
              </span>{' '}
              {message.message}
              <h5>{message.createdAt}</h5>
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
      <button onClick={info}>info</button>
    </div>
  );
};

export default withRouter(ChatroomPage);
