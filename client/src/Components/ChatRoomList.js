import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ChatRoomList extends Component {
    static propTypes = {
        prop: PropTypes
    }
    //TODO : Chatroom list gets own room id
    // render all chatroom list that the user belongs to ({chatRoomId,chatRoomName, all userImgUrl belong to chatRoomId, lastUpdatedAt,})
    // add switch tab event handler to render   
    // dynamically show chat room when a user click each chatroom.
    
    render() {

        return (
            <aside className="chatRoom_list">chat list</aside>
        )
    }
}
export default ChatRoomList;