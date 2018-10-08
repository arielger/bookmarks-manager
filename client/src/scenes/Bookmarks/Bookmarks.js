import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, Avatar, Button, message } from "antd";
import styled from "styled-components";
import humanizeUrl from "humanize-url";
import BookmarkForm from "./BookmarkForm";
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

  .avatar {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export default class Bookmarks extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  state = {
    bookmarks: [],
    isFetching: false,
    isBookmarkModalOpen: false,
    modalBookmarkId: undefined
  };

  addBookmark = bookmark => {
    this.setState(prevState => ({
      ...prevState,
      bookmarks: prevState.bookmarks.concat(bookmark)
    }));
  };

  editBookmark = bookmark => {
    this.setState(prevState => ({
      ...prevState,
      bookmarks: prevState.bookmarks.map(
        b => (b.id === bookmark.id ? bookmark : b)
      )
    }));
  };

  showBookmarkModal = bookmarkId => {
    this.setState({
      isBookmarkModalOpen: true,
      modalBookmarkId: bookmarkId
    });
  };

  hideNewBookmarkModal = () => {
    this.setState({ isBookmarkModalOpen: false });
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
      });
  }

  deleteBookmark = bookmarkId => {
    this.setState(prevState => ({
      ...prevState,
      bookmarks: prevState.bookmarks.filter(b => b.id !== bookmarkId)
    }));
    bookmarksApi
      .delete(bookmarkId)
      .then(({ data }) => {
        console.log("Deleted bookmark:", data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  render() {
    const { logout } = this.props;
    const { bookmarks, modalBookmarkId } = this.state;

    return (
      <Wrapper>
        <Sidebar
          showAddBookmark={() => {
            this.showBookmarkModal();
          }}
          logout={logout}
        />
        <ListWrapper>
          <List
            className="bookmarks-list"
            itemLayout="horizontal"
            dataSource={bookmarks}
            renderItem={bookmark => (
              <List.Item
                actions={[
                  <Button
                    icon="edit"
                    onClick={() => {
                      this.showBookmarkModal(bookmark.id);
                    }}
                  />,
                  <Button
                    icon="delete"
                    type="danger"
                    onClick={() => {
                      this.deleteBookmark(bookmark.id);
                    }}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size="large"
                      icon="link"
                      src={`https://logo-core.clearbit.com/${bookmark.url}`}
                      className="avatar"
                    />
                  }
                  title={bookmark.title}
                  description={humanizeUrl(bookmark.url)}
                />
              </List.Item>
            )}
          />
        </ListWrapper>
        <BookmarkForm
          isNew={!modalBookmarkId}
          bookmarkData={
            modalBookmarkId ? bookmarks.find(b => b.id === modalBookmarkId) : {}
          }
          handleSubmit={modalBookmarkId ? this.editBookmark : this.addBookmark}
          visible={this.state.isBookmarkModalOpen}
          closeModal={this.hideNewBookmarkModal}
        />
      </Wrapper>
    );
  }
}
