import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useModal } from '../../context/Modal';


import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const {closeModal} = useModal()

  if (sessionUser) return (
    <Redirect to="/" />
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal())
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }


  const demoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({'credential': 'Demo-lition', 'password': 'password'}))
      .then(closeModal())
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      )
  }

  return (
    <form onSubmit={handleSubmit}>
    <h1 className='login-text'>Login</h1>
      <ul className='login-errors-ul'>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className='login-label'>
        Username or Email
        <input
          className='login-inputs'
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label className='login-label'>
        Password
        <input
          className='login-inputs'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className='login-button' type="submit" disabled={(credential.length <= 4 || password.length <=6)}>Log In</button>
      <button className='login-button' type="submit" onClick={demoUser}>Demo User</button>
    </form>
  );
}

export default LoginFormPage;
