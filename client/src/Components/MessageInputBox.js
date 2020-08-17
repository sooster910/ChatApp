import React, { Component,createRef } from 'react'
import InputOptionList from './InputOptionList'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

export default class MessageInputBox extends Component {
    constructor(props){
        super();   
        this.state = {
            message: '',
        }
    this.inputRef = React.createRef();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.resetMessage = this.resetMessage.bind(this);
    }

    resetMessage = ()=> {
    
        this.setState({message:''})
    }

    setMessage = (message)=>{
        console.log('message',message)
        this.props.showMessage(message);
        this.resetMessage();

    };


    handleInputChange=(e)=>{

       this.setState({message:e.target.value})
    }

    handleKeyPress=(e)=>{
      if(e.keyCode == 13 ||e.which === 13 ||e.key === "Enter" )
         this.setMessage(e.target.value) 
    }

    componentDidMount(){
        console.log(this.inputRef)
        this.inputRef.current && this.inputRef.current.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        this.inputRef.current && this.inputRef.current.focus();
      }

    render() {
        const {message} = this.state;
     
        return (
            <div className="chatRoom_input_wrapper">
               <InputOptionList />
           
                <div className="chatRoom_input_box">
                <textarea type="text" ref={this.inputRef} value={message} placeholder="Type something to send" onChange={this.handleInputChange} onKeyDown={(e=>this.handleKeyPress(e))}/>
                <button className="send_button"><FontAwesomeIcon icon={faPaperPlane} /></button>
                </div>
            </div>
        )
    }
}
