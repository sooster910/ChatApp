import React from 'react';

const ChatRoom = ({ messages, onChange, sendMessage, message }) => {
  return (
    <div>
      {messages.length === 0 ? (
        <div>표시할 메시지가 없습니다!</div>
      ) : (
        messages.map((message, i) => (
          <div key={i}>
            {message.name} : {message.message}
          </div>
        ))
      )}
      <div>
        <input
          type="text"
          name="message"
          placeholder="Say Somthing!"
          onChange={onChange}
          value={message}
        />
        <button onClick={sendMessage}>Send!</button>
      </div>
    </div>
  );
};

export default ChatRoom;
