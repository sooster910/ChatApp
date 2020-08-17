import client from './client';

// chatroom 목록
export const getChatroomList = async () => {
  try {
    const response = await client.get('http://localhost:4000/chatroom/', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    if (error.response.status === 401) {
      // 401 에러처리 하려면 이곳
      return;
    }
    // setTimeout(getChatroomList, 3000);
    // 401 아니면 요청을 더 시도해본다
  }
};

// chatroom 생성
export const createRoom = async (name) => {
  try {
    const response = await client.post('http://localhost:4000/chatroom/', {
      name,
    });
    alert('createSuccess');
    return response.data;
  } catch (error) {
    alert(error.response.data.message);
    return error.response.data.message;
  }
};

// get chatroom data
export const getChatroomData = () =>
  client
    .get('http://localhost:4000/chatroom/:id', { withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
