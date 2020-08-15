import client from './client';

// chatroom 목록
// export const getChatroomsList = async () => {
//   try {
//     const response = await client.get('http://localhost:4000/chatroom/', {
//       withCredentials: true,
//     });
//   } catch (error) {}
// };

export const getChatroomsList = () =>
  client
    .get('http://localhost:4000/chatroom/', { withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err.message);
      if (err.response.status === 401) {
        // 401 에러처리 하려면 이곳
        return;
      }
      setTimeout(getChatroomsList, 3000);
      // 401 아니면 요청을 더 시도해본다
    });

// chatroom 생성
export const createRoom = (name) =>
  client
    .post('http://localhost:4000/chatroom/', {
      name,
    })
    .then((response) => {
      alert('createSucess');
      return response.data;
    })
    .catch((err) => {
      alert(err);
      return err;
    });

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
