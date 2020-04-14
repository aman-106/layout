import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './authenticateUser';
import { paths } from './App';
import _get from 'lodash/get';

const useInput = (defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);
  const onChange = event => setValue(_get(event, 'target.value', ''));
  return [value, onChange];
};


const Login = props => {
  const [username, setUserName] = useInput('');
  const [password, setPassword] = useInput('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAuthState, handleAuthenticateUser, handleLogout] = useAuth();

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    if (username && password) {
      handleAuthenticateUser(username, password);
    }
  }, [username, password]);

  useEffect(
    function () {
      if (userAuthState.authenticated === true) {
        props.history.push(paths.layout);
      }
    },
    [userAuthState]
  );

  return (
    <div className="auth-wrapper">
      <div className="header">
        <span className="header__title">login</span>
      </div>
      <div className="form-login">
        <label htmlFor="username">{'Name'}</label>
        <input
          type="text"
          label="username"
          name="username"
          value={username}
          onChange={setUserName}
          className={username ? '' : 'error'}
        />
        {/* hide password value from DOM */}
        <div onChange={setPassword}>
          <label htmlFor="password">{'Password'}</label>
          <input
            type="password"
            label="password"
            name="password"
            className={password ? '' : 'error'}
          />
        </div>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div >
  );
};


export default Login;
