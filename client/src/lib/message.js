import client from './client';

// get chatRoom Message
export const getMessageThisChatroom = (chatroomId) =>
  client
    .get(`http://localhost:4000/message/${chatroomId}`, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err.message);
    });
