import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, Avatar, Button } from "antd";
import styled from "styled-components";
import NewBookmark from "./NewBookmark";
import Sidebar from "./Sidebar";
import { bookmarks as bookmarksApi } from "../../api";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f7f8fc;
`;

const ListWrapper = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-grow: 1;

  .bookmarks-list {
    width: 100%;
  }
`;

export default class Bookmarks extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  state = {
    bookmarks: [],
    isFetching: false,
    isNewBookmarkModalOpen: false
  };

  showNewBookmarkModal = () => {
    this.setState({ isNewBookmarkModalOpen: true });
  };

  hideNewBookmarkModal = () => {
    this.setState({ isNewBookmarkModalOpen: false });
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
    const { logout } = this.props;

    return (
      <Wrapper>
        <Sidebar showAddBookmark={this.showNewBookmarkModal} logout={logout} />
        <ListWrapper>
          <List
            className="bookmarks-list"
            itemLayout="horizontal"
            dataSource={this.state.bookmarks}
            renderItem={bookmark => (
              <List.Item
                actions={[
                  <Button icon="edit" />,
                  <Button icon="delete" type="danger" />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size="large"
                      icon="link"
                      src={`https://logo-core.clearbit.com/${bookmark.url}`}
                    />
                  }
                  title={bookmark.title}
                  description={bookmark.url}
                />
              </List.Item>
            )}
          />
        </ListWrapper>
        <NewBookmark
          visible={this.state.isNewBookmarkModalOpen}
          closeModal={this.hideNewBookmarkModal}
        />
      </Wrapper>
    );
  }
}
