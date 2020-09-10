import React, { useState, useEffect } from 'react';
import Drawer from '../components/Drawer';
import { getChannelList } from '../lib/user';

const DrawerContainer = () => {
  const [channelList, setChannelList] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');
  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = async () => {
    const response = await getChannelList();
    setChannelList(response.channelList);
    setCurrentChannel(response.currentChannel);
  };

  return <Drawer channelList={channelList} currentChannel={currentChannel} />;
};

export default DrawerContainer;
