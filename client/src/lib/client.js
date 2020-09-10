import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = 'http://localhost:4000/';

// 요청 전 헤더에 토큰을 실어주기 위한 인터셉터
client.interceptors.request.use(function (config) {
  try {
    const user = localStorage.getItem('access_token');
    if (user) config.headers.common['Authorization'] = `Bearer ${user}`;
  } catch (err) {
    console.log('localStorage is not working');
  }
  return config;
});

// 응답 인터셉터
client.interceptors.response.use(
  (response) => {
    // 요청 성공
    // console.log(response);
    return response;
  },
  (error) => {
    // 요청 실패
    // console.log(error);
    return Promise.reject(error);
  },
);

export default client;
