import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, Button } from "antd";
import CreateBookmark from "../CreateBookmark";
import { bookmarks as bookmarksApi } from "../../api";

export default class BookmarksList extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  state = {
    bookmarks: [],
    isFetching: false
  };

  componentDidMount() {
    this.setState({ isFetching: true });

    bookmarksApi
      .getAll(this.props.userToken)
      .then(({ data }) => {
        this.setState({ isFetching: false, bookmarks: data });
      })
      .catch(error => {
        console.error("Error:", error);
        this.setState({ error });
      });
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.logout}>Log out</Button>
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
