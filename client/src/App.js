import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignUp from "./account/SignUp";
import LogIn from "./account/LogIn";
import BookmarksList from "./bookmarks/BookmarksList";

class App extends Component {
  state = {
    userToken: sessionStorage.getItem("jwtToken") || ""
  };

  setUserToken = userToken => {
    sessionStorage.setItem("jwtToken", userToken);
    this.setState({ userToken });
  };

  render() {
    const isAuthenticated = !!this.state.userToken;

    return (
      <div className="App">
        <Switch>
          {!isAuthenticated && (
            <Switch>
              <Route
                path="/signup"
                render={() => <SignUp setUserToken={this.setUserToken} />}
              />
              <Route
                path="/login"
                render={() => <LogIn setUserToken={this.setUserToken} />}
              />
              <Redirect to="/login" />
            </Switch>
          )}
          <Route
            path="/"
            exact
            render={() => <BookmarksList userToken={this.state.userToken} />}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
