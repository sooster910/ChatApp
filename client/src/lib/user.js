import client from './client';

// get Channel List
export const getChannelList = async () => {
  try {
    const response = await client.get('user/channelList', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
