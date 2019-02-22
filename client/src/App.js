import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import {
  SignUp,
  LogIn,
  PasswordForgot,
  PasswordReset,
  Bookmarks
} from "./scenes";

const App = connect(({ user }) => ({
  isAuthenticated: user.isAuthenticated
}))(({ isAuthenticated }) => {
  return (
    <div className="App">
      <Switch>
        {!isAuthenticated && (
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={LogIn} />
            <Route path="/password/forgot" component={PasswordForgot} />
            <Route path="/password/reset" component={PasswordReset} />
            <Redirect to="/login" />
          </Switch>
        )}
        <Route path={["/folders/:folderId", "/"]} component={Bookmarks} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
});

export default App;
