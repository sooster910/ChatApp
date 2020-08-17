import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default class Nav extends Component {
    render() {
        return (

            <nav>
              
                <div className="user_profile_pic_wrapper">
                    <div className="user_profile_pic">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </div>
            </nav>
        )
    }
}
