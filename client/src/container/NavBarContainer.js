import React,{useState,useEffect} from 'react';
import { logout,uploadAvatar,getAvatar } from '../lib/user';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ProfileEditor from '../components/ProfileEditor';
import axios from 'axios';
// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const [picture, setPictures] = useState();
  const [open, setOpen] = useState(false);
 
  const onDrop =(e)=>{
   
    if(!e.target.files[0]) return;

    //TODO: Fix to allow same image you clicked. 
    setPictures(e.target.files[0]);
    setOpen(true);

    console.log('images',picture)

      // return (<ProfileImgModal/>)
  }

  const handleUploadImage = async() =>{
  
    console.log('picture',picture)
    console.log('handleUploadImage')
    let data = new FormData();

    console.log('data',data);
    data.append('image', picture, picture.name)
    console.log('data',data)

   const resp =  await uploadAvatar(picture);
    if(resp){
      console.log('resp',resp);
    }
  }
  const handleClose = () => {
    setOpen(false);
    setPictures();
  };
  const onLogout = async () => {
    try {
      const response = await logout();
      socket.emit('disconnect');
      history.push('/');
    } catch (error) {
      console.log('...?');
    }
  };
  return (

    <nav>
      <ProfileEditor open={open} onClose={handleClose} file={picture} handleUploadImage={handleUploadImage}/>
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic" style={{ "display": "flex", "flexDirection": "column" }}>
          <FontAwesomeIcon icon={faUser} />

        </div>
        <input type="file" className="user_profile_pic_input" onChange={onDrop} accept="image/*" />
        {/* <button className="upload" onClick={handleUploadImage}>Upload</button> */}

      </div>


      <button onClick={onLogout}>임시 로그아웃 버튼</button>
      <img src="https://chat-app-profile-bucket.s3.ap-northeast-2.amazonaws.com/5f4d75ecd0e96a261d3b0ac1/d84cff71-2e6a-47e1-99b1-9263ebed6cb2" />
    </nav>

  );
};

export default withRouter(NavBarContainer);
