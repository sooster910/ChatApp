import React from 'react'

const Message=({message, user,key})=> {
 //TODO:check current user

    return (
        <div className="message_wrapper" key={key}>
            <p className="message">{message}</p>
            <img className="message_user" src= { user ? user.imgUrl : "images/profile.svg"} alt="useProfilePic"/>

        </div>
    )
}
export default Message;