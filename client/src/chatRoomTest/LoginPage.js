import React, { createRef } from 'react';
import { withRouter } from 'react-router-dom';
import { login } from '../lib/user';

const LoginPage = (props) => {
  const emailRef = createRef();
  const passwordRef = createRef();

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const loginRes = await login(email, password);
    if (loginRes) {
      props.history.push('/');
      props.setupSocket();
    }
  };

  return (
    <div className="card">
      <div className="cardHeader"></div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={emailRef} />
          <hr />
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordRef}
          />
          <hr />
        </div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => props.history.push('/signup')}>signup</button>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
