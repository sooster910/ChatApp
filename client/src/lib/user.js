import client from './client';
import axios from 'axios';
import s3Storage from 'multer-s3';

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
  console.log('file',file)
     const uploadConfig = await client.get(`http://localhost:4000/user/profile/avatar?contentType=${file.type}`);
      console.log('uploadConfig',uploadConfig)
      const options = {
      headers: {
        'Content-Type':file.type,
         'x-amz-acl': 'public-read',
      }
    };
    if(uploadConfig){
      debugger
      await axios.put(uploadConfig.data.url,file,options)
    }
      //  await fetch(uploadConfig.data.url, {
    //     method: "PUT",
    //     body: file,
    //     headers:{'Content-Type':file.type}
    //   })
//   const {url} = await (await client.get(`/http://localhost:4000/user/profile/avatar?contentType=${file.type}`)).json();
// await fetch(url, {
// 	method: "PUT",
// 	body: file,
// })
  // try{
  //   console.log('file type',file.type)
  //   const uploadConfig = await client.get(`http://localhost:4000/user/profile/avatar?contentType=${file.type}`);
  //   console.log('uploadConfig', uploadConfig.data)
  //   const options = {
  //     headers: {
  //       'Content-Type':file.type,
  //        'x-amz-acl': 'public-read',
  //     }
  //   };
  //   if(uploadConfig){
  //     debugger
  //     await axios.put(uploadConfig.data.url,file,options)
  //   }
  // // let data = await readFile (file);
  // // const response = await axios.put(uploadConfig.data, file, options)
  // //   console.log('response',response)
  // //   // const response = await fetch(uploadConfig.data.url, {method:'PUT',mode:'cors', body:file})
  // //   // console.log('response',response)

  // }catch(err){
  //   console.log('err',err)
   
  // }

}