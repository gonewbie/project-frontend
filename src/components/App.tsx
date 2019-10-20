import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import Header from './Header';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Article from './Article';
import Profile from './Profile';
import Editor from './Editor';
import Settings from './Settings';
import PrivateRoute from './PrivateRoute';
import { getCurrentUser } from '../api/AuthAPI';
import useAuth, { AuthProvider } from '../context/auth';


function App() {
  const {
    state: { user, isAuthenticated },
    dispatch,
  } = useAuth();

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      try {
        const payload = await getCurrentUser();
        const { token, ...user } = payload.data.user;
        if (!ignore) {
          dispatch({ type: 'LOAD_USER', user });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (!user && isAuthenticated) {
      fetchUser();
    }

    return () => {
      ignore = true;
    };
  }, [dispatch, isAuthenticated, user]);

  if (!user && isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Router>
        <Home default path="/" />
        <Register path="register" />
        <Login path="login" />
        <Article path="article/:slug" />
        <Profile path=":username" />
        <PrivateRoute as={Settings} path="/settings" />
        <PrivateRoute as={Editor} path="/editor" />
        <PrivateRoute as={Editor} path="/editor/:slug" />
      </Router>
    </>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)