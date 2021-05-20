import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'screens/Home';
import Register from 'screens/Register';
import ErrorBoundary from 'components/ErrorBoundary';
import Activation from 'screens/Activation';
import Login from 'screens/Login';
import ForgotPassword from 'screens/ForgotPassword';
import PageNotFound from 'screens/PageNotFound';
import { ToastContainer } from 'react-toastify';
import ResetPassword from 'screens/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';

const routes = () => {
  return (
    <div className='app'>
      <ToastContainer />
      <BrowserRouter>
        <ErrorBoundary>
          <Switch>
            <Route path='/' exact render={props => <Home {...props} />} />
            <Route path='/register' exact component={Register} />
            <Route path='/login' exact component={Login} />
            <Route path='/users/activate/:token' exact component={Activation} />
            <Route
              path='/users/password/forget'
              exact
              component={ForgotPassword}
            />
            <Route
              path='/users/password/reset/:token'
              exact
              component={ResetPassword}
            />
            <Route path='*' exact component={PageNotFound} />
          </Switch>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
};

export default routes;
