import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();


  let buttonDisabled =  (
    !email.length
    || !username.length
    || username.length < 4
    || !firstName.length
    || !lastName.length
    || !password.length
    || password.length < 6
    || !confirmPassword.length
    || confirmPassword !== password
    )

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(() => closeModal())
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
    <div className='signupform-container'>
      <div className='signup-text'>Sign Up</div>
      <form
        id="signup-form"
        onSubmit={handleSubmit}>
          {errors.length ?
          <ul className='signup-errors-ul'>
            {errors.map((error, idx) => <li className='signup-errors-li' key={idx}>{error}</li>)}
          </ul>
          : <div className='signup-errors-div'> </div>}

        <label className='signup-label'>
          Email
          <input
            className="signup-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className='signup-label'>
          Username
          <input
            className="signup-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className='signup-label'>
          First Name
          <input
            className="signup-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className='signup-label'>
          Last Name
          <input
            className="signup-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label className='signup-label'>
          Password
          <input
            className="signup-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className='signup-label'>
          Confirm Password
          <input
            className="signup-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className='signup-button' type="submit" disabled={buttonDisabled} >Sign Up</button>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;
