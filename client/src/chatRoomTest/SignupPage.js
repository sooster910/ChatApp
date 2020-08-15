import React, { createRef } from 'react';
import { withRouter } from 'react-router-dom';
import { signup } from '../lib/user';

const SignupPage = (props) => {
  const firstnameRef = createRef();
  const lastnameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();

  const handleSignup = async () => {
    const firstname = firstnameRef.current.value;
    const lastname = lastnameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await signup(firstname, lastname, email, password);

    console.log(response);

    if (response) props.history.push('/');
  };

  return (
    <div className="card">
      <div className="cardHeader"></div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="firstname">firstname</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            ref={firstnameRef}
          />
          <hr />
          <label htmlFor="lastname">lastname</label>
          <input type="text" name="lastname" id="lastname" ref={lastnameRef} />
          <hr />
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
        <button onClick={handleSignup}>SignUp</button>
      </div>
    </div>
  );
};

export default withRouter(SignupPage);
