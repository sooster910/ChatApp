import React,{useState} from 'react';
import { logout } from '../lib/user';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ImageUploader from 'react-images-upload';


// 좌측 메뉴 바
const NavBarContainer = ({ history, socket }) => {
  const [picture, setPictures] = useState(picture:{});


  const onLogout = async () => {
    try {
      const response = await logout();
      socket.emit('disconnect');
      history.push('/');
    } catch (error) {
      console.log('...?');
    }
  };

  const onDrop =(file)=>{
   
    console.log('picture',picture)
    console.log('setpicture',setPictures)
    // const newFile = picture.concat(file);
    // setPictures(newFile);
    // setImages([...images, file])
    setPictures(file);
    console.log('images',picture)


      // return (<ProfileImgModal/>)
  }

  const handleUploadImage = () =>{
    console.log('handleUploadImage')
  }

  return (

    <nav>
      <div className="user_profile_pic_wrapper">
        <div className="user_profile_pic">
          <FontAwesomeIcon icon={faUser} />
          <ImageUploader 
                withIcon={false}
                withPreview={true}
                buttonText='Choose images'
                onChange={onDrop}
                onClick={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
               
            />
            <button className="upload" onClick = {handleUploadImage}>Upload</button>
        
        </div>
      </div>
      <button onClick={onLogout}>임시 로그아웃 버튼</button>
    </nav>

  );
};

export default withRouter(NavBarContainer);
