import React from 'react'
import Message from './Message';

const Messages = ({ messages, user }) => {
   if(!messages){
       return null;
   }
        return (
            <div>
                {messages.map((message, i) => <Message message={message} user={user} key={i} />)}
            </div>
        )
    
}
export default Messages;