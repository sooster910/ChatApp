import client from './client';
import axios from 'axios';


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
    console.log('...');
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data.message;
  }
};

// 상태 확인
export const check = () =>
client.get('http://localhost:4000/user/check').then().catch();

// 로그아웃
export const logout = async () => {
  try {
    const response = await client.post('http://localhost:4000/user/logout');
    alert('로그아웃 되었습니다');
    localStorage.removeItem('access_token');
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.removeItem('access_token');
  }
};



export const uploadAvatar = async(file)=>{

     const uploadConfig = await client.get(`http://localhost:4000/user/profile/avatar?contentType=${file.type}`);
      console.log('uploadConfig',uploadConfig)
      const options = {
      headers: {
        'Content-Type':file.type,
         'x-amz-acl': 'public-read',
      }
    };

    if(uploadConfig){
      //TODO::logic for checking if file is existed then, delete existing file from user folder
      const resp= await axios.put(uploadConfig.data.url,file,options)
      console.log('resp',resp);
    
     //update user profile
     const url = new URL(uploadConfig.data.url);
     const userImgUrl= url.pathname;
     try{
      const res = await client.patch('http://localhost:4000/user/update', {userImgUrl})
      console.log('updateUserImgUrl', res)
      return res;
     }catch(err){
        console.log(err)
     }
     
    }    
}

export const getUserImage = async()=>{
 
  try{
    const resp = await client.get('http://localhost:4000/user/profile/userImage');
    const url = `https://chat-app-profile-bucket.s3.ap-northeast-2.amazonaws.com${resp.data}`;
    return url;
  }catch(err){
    console.log(err);
  }
}
