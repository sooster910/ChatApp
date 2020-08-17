import React from 'react';
import { logout } from '../lib/user';
import { withRouter } from 'react-router-dom';

// 좌측 메뉴 바
const LeftNaviContainer = ({ history, socket }) => {
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
    <div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
    </div>
  );
};

export default withRouter(LeftNaviContainer);
