import React, { Component } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import { List, Avatar, Button, Spin, Icon } from "antd";
import styled from "styled-components";
import humanizeUrl from "humanize-url";
import InfiniteScroll from "react-infinite-scroller";
import BookmarkForm from "./BookmarkForm";
import Sidebar from "./Sidebar";
import { bookmarks as bookmarksApi, folders as foldersApi } from "../../api";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f7f8fc;
`;

const ListWrapper = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;

  .bookmarks-list {
    width: 100%;
  }

  .avatar {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default class Bookmarks extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  state = {
    bookmarks: [],
    folders: [],
    isFetching: false,
    hasMore: true,
    isBookmarkModalOpen: false,
    modalBookmarkId: undefined
  };

  componentDidMount() {
    foldersApi.getAll().then(({ data: folders }) => {
      this.setState({ folders });
    });
  }

  componentDidUpdate({ match: prevMatch }) {
    const { match } = this.props;

    if (
      R.path(["params", "folderId"], match) !==
      R.path(["params", "folderId"], prevMatch)
    ) {
      this.setState({
        bookmarks: [],
        hasMore: true
      });
    }
  }

  addBookmark = bookmark => {
    this.setState(prevState => ({
      ...prevState,
      bookmarks: prevState.bookmarks.concat(bookmark)
    }));
  };

  editBookmark = bookmark => {
    this.setState(prevState => ({
      ...prevState,
      bookmarks: prevState.bookmarks.map(b =>
        b.id === bookmark.id ? bookmark : b
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

  loadBookmarksPage = page => {
    const { match } = this.props;
    const folderId = R.path(["params", "folderId"], match);

    this.setState({ isFetching: true });
    bookmarksApi
      .fetch(page, folderId)
      .then(({ data }) => {
        this.setState(prevState => ({
          isFetching: false,
          hasMore: data.info.morePagesAvailable,
          bookmarks: [...prevState.bookmarks, ...data.results]
        }));
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  render() {
    const { logout, match } = this.props;
    const {
      folders,
      isFetching,
      hasMore,
      bookmarks,
      modalBookmarkId
    } = this.state;

    return (
      <Wrapper>
        <Sidebar
          createFolder={foldersApi.create}
          folders={folders}
          showAddBookmark={() => {
            this.showBookmarkModal();
          }}
          logout={logout}
        />
        <ListWrapper>
          <InfiniteScroll
            key={R.path(["params", "folderId"], match)}
            initialLoad={true}
            loadMore={this.loadBookmarksPage}
            hasMore={!isFetching && hasMore}
            useWindow={false}
          >
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
            {isFetching && (
              <SpinContainer>
                <Spin indicator={<Icon type="loading" spin />} />
              </SpinContainer>
            )}
          </InfiniteScroll>
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
