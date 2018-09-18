import React, { Component } from "react";
import { List } from "antd";
import CreateBookmark from "../CreateBookmark";

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export default class BookmarksList extends Component {
  state = {
    bookmarks: [],
    isFetching: false
  };

  componentDidMount() {
    this.setState({ isFetching: true });

    fetch("/bookmarks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.props.userToken
      }
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(res => {
        this.setState({ isFetching: false, bookmarks: res });
      })
      .catch(error => {
        console.error("Error:", error);
        this.setState({ error });
      });
  }

  render() {
    return (
      <div>
        <h1>Bookmarks</h1>
        <List
          dataSource={this.state.bookmarks}
          renderItem={bookmark => (
            <List.Item>
              <List.Item.Meta
                title={bookmark.title}
                description={bookmark.description}
              />
            </List.Item>
          )}
        />
        <CreateBookmark userToken={this.props.userToken} />
      </div>
    );
  }
}
