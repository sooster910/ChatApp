import React, { useState, useEffect } from 'react';
import { logout } from '../lib/auth';
import { getChannelList } from '../lib/user';
import { withRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    // 기본 세팅
    getChannels();
  }, []);

  const getChannels = async () => {
    const response = await getChannelList();
    setChannelList(response.channelList);
  };

  const call = () => {
    getChannels();
    console.log(channelList);
  };

  const onLogout = async () => {
    try {
      await logout();
      history.push('/');
      if (socket) {
        // 연결된 socket이 있다면 disconnect
        socket.disconnect();
      }
    } catch (error) {}
  };

  return <NavBar onLogout={onLogout} channelList={channelList} call={call} />;
};

export default withRouter(NavBarContainer);
