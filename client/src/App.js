import React, { Component } from "react";
import { Route } from "react-router-dom";
import SignUp from "./account/SignUp";
import LogIn from "./account/LogIn";
import BookmarksList from "./bookmarks/BookmarksList";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
        {/* @todo: Authenticate bookmarks route */}
        <Route path="/" exact component={BookmarksList} />
      </div>
    );
  }
}

export default App;
