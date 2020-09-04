import client from './client';

// 로그인
export const login = async (email, password) => {
  try {
    const response = await client.post(
      'http://localhost:4000/auth/login',
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    localStorage.setItem('access_token', response.data.token);
    // 해당 유저가 기본 구독중인 channel에 맞춰 io정보를 넣어서 socket 연결에 씀
    if (response.data.io) {
      localStorage.setItem('io_token', response.data.io);
    }
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};

// 회원가입
export const signup = async (firstname, lastname, email, password) => {
  try {
    const response = await client.post(
      'http://localhost:4000/auth/signup',
      {
        firstname,
        lastname,
        email,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data.message;
  }
};

// 상태 확인
export const check = () =>
  client.get('http://localhost:4000/auth/check').then().catch();

// 로그아웃
export const logout = async () => {
  try {
    const response = await client.post('http://localhost:4000/auth/logout');
    alert('로그아웃 되었습니다');
    localStorage.removeItem('access_token');
    localStorage.removeItem('io_token');
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    // error가 나더라도 localStorage를 지움
    localStorage.removeItem('access_token');
    localStorage.removeItem('io_token');
  }
};
