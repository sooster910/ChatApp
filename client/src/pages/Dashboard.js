import React, { Component } from 'react'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import ChatRoomList from '../container/ChatRoomListContainer'
import ChatRoom from '../Components/ChatRoom'
import io from 'socket.io-client'

class Dashboard extends Component {
    constructor(props){
        super(props)
        
    }
    render() {
        return (
            <React.Fragment>
                <header><h1>Dashboard page</h1></header>
                <section id="dashboard"> 
                    <Nav />
                    <ChatRoomList />
                    <ChatRoom />
                </section>
            </React.Fragment>

        )
    }
}
export default Dashboard;