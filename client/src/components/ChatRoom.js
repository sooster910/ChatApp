import React, { Component, createRef } from './node_modules/react'
import { FontAwesomeIcon } from "./node_modules/@fortawesome/react-fontawesome";
import { faPaperPlane } from "./node_modules/@fortawesome/free-solid-svg-icons";


const ChatRoom = ({ messages, onChange, sendMessage, message, onKeyPress }) => {
  return (
    <React.Fragment>
      {messages.length === 0 ? (
        <div>표시할 메시지가 없습니다!</div>
      ) : (
          messages.map((message, i) => (
            <div key={i}>
              {message.name} : {message.message}
            </div>
          ))
        )}
      <div className="chatRoom_input_wrapper">
        {/* <InputOptionList /> */}

        <div className="chatRoom_input_box">
          <textarea type="text" name="message" value={message} placeholder="Type something to send" onChange={onChange} onKeyPress={onKeyPress} />
          <button className="send_button" onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /></button>
        </div>

     
      </div>
    </React.Fragment>
  );
};

export default ChatRoom;
