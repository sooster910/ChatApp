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
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.removeItem('access_token');
  }
};
