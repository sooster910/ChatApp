import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ onLogout, channelList, call }) => {
  return (
    <nav>
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
      <div>
        {channelList.map((val) => (
          <div key={val._id}>{val.name}</div>
        ))}
      </div>
      <button onClick={call}>테스트</button>
    </nav>
  );
};

export default NavBar;
