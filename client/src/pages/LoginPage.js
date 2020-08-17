import React from 'react';
import LoginContainer from '../container/LoginContainer';

const LoginPage = ({ setupSocket }) => {
  return <LoginContainer setupSocket={setupSocket} />;
};

export default LoginPage;
