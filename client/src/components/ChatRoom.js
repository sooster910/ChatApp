import React, { Component, createRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {faSmile} from "@fortawesome/free-regular-svg-icons";
import Avatar from '@material-ui/core/Avatar';
import Picker from 'emoji-picker-react';
import styled from 'styled-components';

const MessagesContainer = styled.article`
  position:relative;
  height: calc(100% - 122px);
  overflow-y: scroll;
`;

const MessageContainer = styled.div`
  display:flex;
  align-items: center;
  padding:10px 15px;
  :hover {
		background: rgba(75,75,150,0.1);
    cursor: pointer;
    
	}
`;
const Message = styled.div`
  position:relative;
  margin-left:6px;
`;
const ChatRoom = ({ messages, onChange, sendMessage, message, onKeyPress, onEmojiClick,onTriggerEmoji, emoji, inputRef, lastestMsgRef}) => {
  return (
    <React.Fragment>
      <MessagesContainer>
             {messages.length === 0 ? (
        <div>표시할 메시지가 없습니다!</div>
      ) : (
          messages.map((message, i) => (
            <MessageContainer key={i} className={i===messages.length-1?'yes':null} ref={i===messages.length-1?lastestMsgRef:null}>
               {message.userImgUrl?<Avatar alt="userImg" src={`https://chat-app-profile-bucket.s3.ap-northeast-2.amazonaws.com${message.userImgUrl}`}/>
               :<Avatar>{message.name.charAt(0)}</Avatar> }
               <Message>{message.message}</Message>
            </MessageContainer>
          ))
         
        )}
        </MessagesContainer>
  
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
