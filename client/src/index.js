import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';

function loadUser() {
  try {
    const user = localStorage.getItem('access_token');
    if (!user) return; // localStorage에 access_token이 없다면 로그인 되지 않은 것이므로 아무것도 하지 않는다

    // 여기서 user 정보를 체크해서 logout 시키거나 그런 로직을 짜도록 한다.
    // check User
  } catch (err) {
    console.log('localStorage is not working');
  }
}

loadUser();

const app = <App />;

ReactDom.render(app, document.getElementById('root'));
