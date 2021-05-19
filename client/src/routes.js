import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'screens/Home';
import Register from 'screens/Register';
import ErrorBoundary from 'components/ErrorBoundary';
import Activation from 'screens/Activation';
import Login from 'screens/Login';
import ForgottenPassword from 'screens/ForgottenPassword';
import PageNotFound from 'screens/PageNotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const routes = () => {
  return (
    <div className='app'>
      <ToastContainer />
      <BrowserRouter>
        <ErrorBoundary>
          <Switch>
            <Route path='/' exact render={props => <Home {...props} />} />
            <Route
              path='/register'
              exact
              render={props => <Register {...props} />}
            />
            <Route path='/login' exact render={props => <Login {...props} />} />
            <Route
              path='/users/activate/:token'
              exact
              render={props => <Activation {...props} />}
            />
            <Route
              path='/users/password/forget'
              exact
              render={props => <ForgottenPassword {...props} />}
            />
            <Route
              path='*'
              exact
              render={props => <PageNotFound {...props} />}
            />
          </Switch>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
};

export default routes;
