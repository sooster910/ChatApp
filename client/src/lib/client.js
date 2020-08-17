import axios from 'axios';

const client = axios.create();

// 인터셉터로 변경
client.interceptors.request.use(function (config) {
  try {
    const user = localStorage.getItem('access_token');
    if (user) config.headers.common['Authorization'] = 'Bearer ' + user;
  } catch (err) {
    console.log('localStorage is not working');
  }
  return config;
});

export default client;
