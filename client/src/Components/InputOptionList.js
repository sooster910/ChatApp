import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane,faImage} from "@fortawesome/free-solid-svg-icons";
import {faSmile} from "@fortawesome/free-regular-svg-icons";




class InputOptionList extends Component {
    constructor(props){
        super();
        

    }

  
    render() {
      
        return (
            <div className="input_option_list">
                <ul>
                    <li><FontAwesomeIcon icon={faSmile} /></li>
                    <li><FontAwesomeIcon icon={faImage} /></li>
                    </ul>
            </div>
        )
    }
}
export default InputOptionList;