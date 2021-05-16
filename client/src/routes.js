import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'screens/Home';
import Register from 'screens/Register';
import ErrorBoundary from 'components/ErrorBoundary';

const routes = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <ErrorBoundary>
          <Switch>
            <Route path='/' exact render={props => <Home {...props} />} />
            <Route
              path='/register'
              exact
              render={props => <Register {...props} />}
            />
          </Switch>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
};

export default routes;
