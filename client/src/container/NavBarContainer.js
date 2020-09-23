import React,{useState} from 'react';
import { logout,uploadAvatar } from '../lib/user';
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
    console.log('file',e.target.files[0])
    console.log('picture',picture)
    console.log('setpicture',setPictures)
    // const newFile = picture.concat(file);
    // setPictures(newFile);
    // setImages([...images, file])
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
      <ProfileEditor open={open} onClose={handleClose} file={picture}/>
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic" style={{ "display": "flex", "flexDirection": "column" }}>
          <FontAwesomeIcon icon={faUser} />

        </div>
        <input type="file" onChange={onDrop} accept="image/*" />
        <button className="upload" onClick={handleUploadImage}>Upload</button>

      </div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
      <img src="" />
    </nav>

  );
};

export default withRouter(NavBarContainer);
