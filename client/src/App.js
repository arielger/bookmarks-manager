import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignUp from "./account/SignUp";
import LogIn from "./account/LogIn";
import BookmarksList from "./bookmarks/BookmarksList";

const ConditionalRoute = ({
  shouldRender,
  redirect,
  render,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      shouldRender ? (
        render ? (
          render(props)
        ) : (
          <Component {...props} />
        )
      ) : (
        <Redirect to={redirect} />
      )
    }
  />
);

class App extends Component {
  state = {
    userToken: sessionStorage.getItem("jwtToken") || ""
  };

  setUserToken = userToken => {
    console.log("userToken", userToken);
    sessionStorage.setItem("jwtToken", userToken);
    this.setState({ userToken });
  };

  render() {
    const isAuthenticated = !!this.state.userToken;

    return (
      <div className="App">
        <Switch>
          <ConditionalRoute
            shouldRender={!isAuthenticated}
            path="/signup"
            redirect="/"
            render={() => <SignUp setUserToken={this.setUserToken} />}
          />
          <ConditionalRoute
            shouldRender={!isAuthenticated}
            path="/login"
            redirect="/"
            render={() => <LogIn setUserToken={this.setUserToken} />}
          />
          <ConditionalRoute
            shouldRender={isAuthenticated}
            redirect="/login"
            exact
            component={BookmarksList}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
