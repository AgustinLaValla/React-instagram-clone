/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, createContext, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import { Profile } from './components/profile/Profile';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import Header from './layout/header/Header';
import { auth } from './firebase';
import './App.css';

export const AuthContext = createContext(null);
const requireLogin = (to, from, next) => to.meta.auth ? next.redirect('/') : next()

function App() {

  const [userState, setUserState] = useState(null);

  const updateCurrentUserPic = async (profilePic) => await auth.updateCurrentUser({ photoURL: profilePic })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authState) => setUserState(authState));
    return () => unsubscribe ? unsubscribe() : null;
  }, [])

  return (
    <Router>

      <Header userState={userState} auth={auth} />

      <GuardProvider guards={[requireLogin]} loading={Dashboard} error={Dashboard}>
        <Switch>
          <AuthContext.Provider value={{ userState, updateCurrentUserPic, auth }}>
            <GuardedRoute exact path="/" component={Dashboard} />
            <GuardedRoute exact path="/profile/:id/:viwerId" component={Profile} meta={{ auth: !userState }} />
            <Redirect path="/profile/:id/:viwerId" to='/' />
            <Redirect to='/' />
          </AuthContext.Provider>
        </Switch>
      </GuardProvider>

    </Router>

  );
}

export const useAuthStateProvider = () => useContext(AuthContext);

export default App;
