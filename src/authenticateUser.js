// import axios, {getRefreshToken} from '../../utils/axiosWrapper';
import React, { useContext, useState, createContext, useCallback } from 'react';
import PropTypes from 'prop-types';

export const authenticateUser = function (userName, password) {

  return new Promise(resolve => {
    const userinfo = {
      userName,
      password,
    };
    localStorage.setItem('userinfo', userinfo)
    resolve(userinfo);
  });

}

const defaultUserAuthState = {
  authenticated: {},
  info: null,
};

const getAuthenticatedInfo = () => {
  let token = localStorage.getItem('userinfo');
  // token = Jtoken);
  // console.log('token', token, typeof token);
  if (token && token.userName) {
    return {
      authenticated: true,
      info: token,
    }
  }
  return defaultUserAuthState;

};

export function useAuthenticateUser() {
  const [userAuthState, setAuthenticateUser] = useState(getAuthenticatedInfo());

  function onSuccess(userinfo) {
    setAuthenticateUser({
      authenticated: true,
      info: userinfo,
    });
  }

  function onfailure() {
    setAuthenticateUser({
      authenticated: false,
      info: null,
    });

  }

  function handleAuthenticateUser(userName, password) {
    authenticateUser(userName, password)
      .then(onSuccess)
      .catch(onfailure);
  }

  function handleLogout() {
    localStorage.setItem('userinfo', {})
    setAuthenticateUser({
      authenticated: false,
      info: null,
    });
  }

  return [userAuthState, useCallback(handleAuthenticateUser), handleLogout];
}

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const authUser = useAuthenticateUser();
  return (
    <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
