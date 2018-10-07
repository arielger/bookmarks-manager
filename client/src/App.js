import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import { SignUp, LogIn, Bookmarks } from "./scenes";

class App extends Component {
  constructor() {
    super();
    const userToken = sessionStorage.getItem("jwtToken") || "";
    this.state = { userToken };
    axios.defaults.headers.common["x-access-token"] = userToken;
  }

  setUserToken = userToken => {
    sessionStorage.setItem("jwtToken", userToken);
    this.setState({ userToken });
    axios.defaults.headers.common["x-access-token"] = userToken;
  };

  logout = () => {
    sessionStorage.removeItem("jwtToken");
    this.setState({ userToken: "" });
    axios.defaults.headers.common["x-access-token"] = "";
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
            render={() => (
              <Bookmarks
                logout={this.logout}
                userToken={this.state.userToken}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
