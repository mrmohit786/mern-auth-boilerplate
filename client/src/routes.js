import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from 'screens/Home';
import Register from 'screens/Register';

const routes = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact render={props => <Home {...props} />} />
          <Route
            path='/register'
            exact
            render={props => <Register {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default routes;
