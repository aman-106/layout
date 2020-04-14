// import axios, {getRefreshToken} from '../../utils/axiosWrapper';
import React, { useContext, useState, createContext, useCallback } from 'react';
import PropTypes from 'prop-types';

export const authenticateUser = function (userName, password) {

  return new Promise(resolve => {
    const userinfo = {
      userName,
      password,
    };
    localStorage.setItem('userinfo', JSON.stringify(userinfo))
    resolve(userinfo);
  });

}

const defaultUserAuthState = {
  authenticated: null,
  info: null,
};

const getAuthenticatedInfo = () => {
  const token = localStorage.getItem('userinfo');
  if (!token) {
    return defaultUserAuthState;
  }
  return {
    authenticated: true,
    info: JSON.parse(token),
  }

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
    localStorage.setItem('userinfo', null)
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
