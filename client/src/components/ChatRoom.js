import React, { Component, createRef } from 'react'
// import MessageInputBox from './MessageInputBox'
// import Messages from './Messages'
// import io from 'socket.io-client';
// import React from 'react';

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
// class ChatRoom extends Component {
//     constructor(props) {
//         super();
//         this.state = {
//             showMessage: [],
//             message: '',
//             messages: []
//         }
//         this.socket = io.connect('http://localhost:5000')

//         console.log('this.socket', this.socket);

//         this.showMessage = this.showMessage.bind(this);
//         this.sendMessage = this.sendMessage.bind(this);


//         this.socket.on('chat', function (data) {
//             console.log('receive chat', data)
//             addMessage(data);
//         });

//         const addMessage = message => {
//             debugger
//             console.log(message);
//              this.setState(state => {
//             const messages = state.messages.concat(message);
//             return { messages }
//         });
//             console.log(this.state.messages);
//         };
//     }

//     componentWillUnmount() {
//         this.socket.close()
//     }

//     // componentDidMount() {
//     //     this.socket.on('chat', message => {
//     //         console.log('did Mount message',message)
//     //         message.key = JSON.stringify(message)
//     //         this.setState((prevState) => {
//     //             let messages = prevState.messages
//     //             messages.push(message)
//     //             {
//     //                 messages: messages
//     //             }
//     //         })
//     //     })
//     // }

//     sendMessage = async (message) => {
//         return await this.socket.emit('chat', { message, timestamp: new Date().toISOString() })
//     }
//     showMessage = async (message) => {

//         await this.sendMessage(message);


//         // this.setState(state => {
//         //     const showMessage = state.showMessage.concat(message);
//         //     return { showMessage }
//         // });
//     }
//     render() {
//         const { showMessage, messages } = this.state;
//         return (

//             <main>
//                 <Messages messages={messages} />
//                 <MessageInputBox showMessage={this.showMessage} />
//             </main>



//         )
//     }
// }

// export default ChatRoom;