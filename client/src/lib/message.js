import client from './client';

// get chatRoom Message
export const getMessageThisChatroom = async (chatroomId) => {
  try {
    const response = await client.get(`message/${chatroomId}`, {
      withCredentials: true,
    });
    console.log('default get success');
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
  }
};
