import React, { useState, useEffect } from 'react';
import { logout, uploadAvatar, getUserImage } from '../lib/user';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ProfileEditor from '../components/ProfileEditor';
import axios from 'axios';
// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const [picture, setPictures] = useState();
  const [open, setOpen] = useState(false);
  const [userImgUrl, setUserImgUrl] = useState('');
  React.useEffect(() => {
    console.log('useEffect start');
    let isMounted = true;
   getUserImage().then(userImgUrl=>{
     if(isMounted){
      setUserImgUrl(userImgUrl)
     }
   
   });
   return ()=>{isMounted=false}
  },[]);

  const onDrop = (e) => {

    if (!e.target.files[0]) return;

    //TODO: Fix to allow same image you clicked. 
    setPictures(e.target.files[0]);
    setOpen(true);

  

  }

  const handleUploadImage = async () => {

    const resp = await uploadAvatar(picture);

    if(resp){
     const previewUrl = URL.createObjectURL(picture);
      setUserImgUrl(previewUrl)
      handleClose();
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
      <ProfileEditor open={open} onClose={handleClose} file={picture} handleUploadImage={handleUploadImage} />
      <div className="user_profile_pic_wrapper">
        {userImgUrl?
        <img className="user_profile_img" src={userImgUrl} alt="userImgUrl"/>:
        <div className="user_profile_pic" style={{ "display": "flex", "flexDirection": "column" }}>
           <FontAwesomeIcon icon={faUser} />
        </div>
        }
        <input type="file" className="user_profile_pic_input" onChange={onDrop} accept="image/*" />

      </div>
      <button className="logout_btn" onClick={onLogout}>임시 로그아웃 버튼</button>
      
    </nav>

  );
};

export default withRouter(NavBarContainer);
