import React, { Component, createRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {faSmile} from "@fortawesome/free-regular-svg-icons";
import Picker from 'emoji-picker-react';

const ChatRoom = ({ messages, onChange, sendMessage, message, onKeyPress, onEmojiClick,onTriggerEmoji, emoji, inputRef}) => {
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
        <button id="emoji" onClick={onTriggerEmoji}><FontAwesomeIcon icon={faSmile}/></button>
        {/* <InputOptionList /> */}
        {/* <Emoji setMeesage={setMessage} message={message} />   */}
        { emoji && <Picker onEmojiClick={onEmojiClick} />}
        <div className="chatRoom_input_box">
          <textarea ref={inputRef} type="text" name="message" value={message} placeholder="Type something to send" onChange={onChange} onKeyPress={onKeyPress} />
          <button className="send_button" onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /></button>
        </div>
     
     
      </div>
    </React.Fragment>
  );
};

export default ChatRoom;
