import client from './client';

// 로그인
export const login = async (email, password) => {
  try {
    const response = await client.post(
      'http://localhost:4000/user/login',
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    console.log(response);
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
      'http://localhost:4000/user/signup',
      {
        firstname,
        lastname,
        email,
        password,
      },
      { withCredentials: true },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data.message;
  }
};

// client
//   .post(
//     'http://localhost:4000/user/signup',
//     {
//       firstname,
//       lastname,
//       email,
//       password,
//     },
//     { withCredentials: true },
//   )
//   .then((response) => {
//     alert('signup!');
//     return response.data;
//   })
//   .catch((err) => {
//     alert(err);
//   });

// 상태 확인
export const check = () =>
  client.get('http://localhost:4000/user/check').then().catch();

// 로그아웃
export const logout = () =>
  client
    .post('http://localhost:4000/user/logout')
    .then((response) => {
      localStorage.removeItem('access_token');
      alert('로그아웃 되었습니다.');
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
