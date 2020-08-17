import React from 'react';
import { logout } from '../lib/user';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const onLogout = async () => {
    try {
      const response = await logout();
      socket.emit('disconnect');
      history.push('/');
    } catch (error) {
      console.log('...?');
    }
  };
  return (

    <nav>
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
    </nav>

  );
};

export default withRouter(NavBarContainer);
