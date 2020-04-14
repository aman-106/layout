import React from "react";
import Layout from './Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "./styles.css";
import { AuthProvider, useAuth } from './authenticateUser';
import Login from './Login';

export const paths = {
  home: '/',
  login: '/',
  layout: '/layout/none',
}

function ProtectedRoute(props) {
  const [userAuthState] = useAuth();
  return userAuthState.authenticated ? (
    <Route {...props} />
  ) : (
      <Redirect to={paths.home} />
    );
}

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router basename={paths.home}>
          <Switch>
            <Route exact path={paths.login} component={Login} />
            <ProtectedRoute path={'/layout/:id'} component={Layout} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}
