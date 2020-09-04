import React, { useState } from 'react';
import AuthTemplate from '../common/AuthTemplate';
import { signup } from '../lib/auth';
import { withRouter } from 'react-router-dom';

const SignupContainer = (props) => {
  const [fieldValidError, setFieldValidError] = useState({
    email: '',
    passowrd: '',
  });
  const [userAuthError, setUserAuthError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
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

    if (form.firstName === '') {
      err = { ...err, firstName: 'Firstname is blank' };
    }
    if (form.lastName === '') {
      err = { ...err, lastName: 'Lastname is blank' };
    }
    if (form.email === '') {
      err = { ...err, email: 'Email is blank' };
    }

    if (form.password.length < 6) {
      err = { ...err, password: 'Password length must be longer than 6' };
    }
    if (form.password === '') {
      err = { ...err, password: 'Password is blank' };
    }

    if (form.passwordConfirm !== form.password) {
      err = {
        ...err,
        passwordConfirm: 'PasswordConfirm and Password is different',
      };
    }

    if (form.passwordConfirm === '') {
      err = {
        ...err,
        passwordConfirm: 'PasswordConfirm is blank',
      };
    }

    if (err) {
      setFieldValidError(err);
      return;
    }

    const signupResult = await signup(
      form.firstName,
      form.lastName,
      form.email,
      form.password,
    );

    if (typeof signupResult === 'string') {
      setUserAuthError(signupResult);
      setForm({ ...form, password: '', passwordConfirm: '' });
    } else {
      alert(signupResult.message);
      props.history.push('/');
    }
  };

  return (
    <AuthTemplate
      type="signup"
      fieldValidError={fieldValidError}
      userAuthError={userAuthError}
      onChange={onChange}
      onSubmit={onSubmit}
      form={form}
    />
  );
};

export default withRouter(SignupContainer);
