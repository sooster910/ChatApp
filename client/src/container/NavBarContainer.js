import React,{useState} from 'react';
import { logout,uploadAvatar } from '../lib/user';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ImageUploader from 'react-images-upload';
import axios from 'axios';
// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const [picture, setPictures] = useState();

  const onDrop =(e)=>{
    console.log('file',e.target.files[0])
    console.log('picture',picture)
    console.log('setpicture',setPictures)
    // const newFile = picture.concat(file);
    // setPictures(newFile);
    // setImages([...images, file])
    setPictures(e.target.files[0]);
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
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic" style={{"display":"flex","flexDirection":"column"}}>
          <FontAwesomeIcon icon={faUser} />
          {/* <ImageUploader 
                withIcon={false}
                withPreview={true}
                buttonText='Choose images'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}

            />
             */}
           
        </div>
        <input type="file" onChange={onDrop} accept="image/*"/>
            <button className="upload" onClick = {handleUploadImage}>Upload</button>
          <h2>{JSON.stringify(picture)}</h2>
      </div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
      <img src =""/>
    </nav>

  );
};

export default withRouter(NavBarContainer);
