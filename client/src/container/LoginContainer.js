import React, { useState } from 'react';
import AuthTemplate from '../common/AuthTemplate';
import { login } from '../lib/auth';
import { withRouter } from 'react-router-dom';

const LoginContainer = (props) => {
  const [fieldValidError, setFieldValidError] = useState({
    email: '',
    passowrd: '',
  });
  const [userAuthError, setUserAuthError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    const { value, name } = e.target;
    let newForm = { ...form };
    newForm[name] = value;
    setForm(newForm);

    // 값이 바뀌면 그 필드의 error를 제거한다
    let newError = { ...fieldValidError };
    newError[name] = '';
    setFieldValidError(newError);

    setUserAuthError('');
  };

  const onSubmit = async (e) => {
    setFieldValidError(''); // error 초기화
    setUserAuthError('');

    e.preventDefault();

    let err = '';

    if (form.email === '') {
      err = { ...err, email: 'Email is blank' };
    }

    if (form.password.length < 6) {
      err = { ...err, password: 'Password length must be longer than 6' };
    }
    if (form.password === '') {
      err = { ...err, password: 'Password is blank' };
    }

    if (err) {
      setFieldValidError(err);
      return; // error가 하나라도 있다면 실행 못하게
    }

    const loginResult = await login(form.email, form.password);

    if (typeof loginResult === 'string') {
      setUserAuthError(loginResult);
      setForm({ ...form, password: '' });
    } else {
      // sucess시 화면전환전에 어떻게 알려줄까
      alert(loginResult.message); // 우선 기본 세팅해둔 message 보이게 해둠
      props.setupSocket();
      props.history.push('/');
    }
  };

  return (
    <AuthTemplate
      type="login"
      fieldValidError={fieldValidError}
      userAuthError={userAuthError}
      onChange={onChange}
      onSubmit={onSubmit}
      form={form}
    />
  );
};

export default withRouter(LoginContainer);
