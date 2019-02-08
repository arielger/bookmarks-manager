import React from "react";
import * as R from "ramda";
import { connect } from "react-redux";
import { List, Avatar, Button } from "antd";
import styled from "styled-components/macro";
import humanizeUrl from "humanize-url";
import InfiniteScroll from "react-infinite-scroller";
import BookmarkForm from "./BookmarkForm";
import Sidebar from "./Sidebar";
import {
  loadBookmarksPage,
  createBookmark,
  deleteBookmark,
  changeFolder
} from "../../store/bookmarks";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
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

const Bookmarks = connect(
  ({ bookmarks }) => ({
    bookmarks: R.reject(R.propEq("hide", true), bookmarks.data),
    isLoading: bookmarks.isLoading,
    isNewBookmarkLoading: bookmarks.isNewBookmarkLoading,
    morePagesAvailable: bookmarks.morePagesAvailable
  }),
  {
    loadBookmarksPage,
    createBookmark,
    deleteBookmark,
    changeFolder
  }
)(
  ({
    bookmarks = [],
    isLoading,
    isNewBookmarkLoading,
    morePagesAvailable,
    loadBookmarksPage,
    createBookmark,
    editBookmark,
    deleteBookmark,
    changeFolder,
    logout,
    match
  }) => {
    const folderId = R.path(["params", "folderId"], match);

    const [bookmarkModal, setBookmarkModal] = React.useState({
      isOpen: false,
      id: undefined
    });

    React.useEffect(
      () => {
        changeFolder();
      },
      [folderId]
    );

    return (
      <Wrapper>
        <Sidebar
          folderId={folderId}
          showAddBookmark={() => {
            setBookmarkModal({ isOpen: true });
          }}
          logout={logout}
        />
        <ListWrapper>
          <InfiniteScroll
            key={folderId}
            initialLoad={true}
            loadMore={page => loadBookmarksPage(page, folderId)}
            hasMore={!isLoading && morePagesAvailable}
            useWindow={false}
          >
            <List
              className="bookmarks-list"
              itemLayout="horizontal"
              dataSource={bookmarks}
              loading={isLoading}
              renderItem={bookmark => (
                <List.Item
                  actions={[
                    <Button
                      icon="edit"
                      onClick={() => {
                        setBookmarkModal({ isOpen: true, id: bookmark.id });
                      }}
                    />,
                    <Button
                      icon="delete"
                      type="danger"
                      onClick={() => {
                        deleteBookmark(bookmark.id);
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
          </InfiniteScroll>
        </ListWrapper>
        <BookmarkForm
          isNew={!bookmarkModal.id}
          isLoading={isNewBookmarkLoading}
          bookmarkData={
            bookmarkModal.id
              ? bookmarks.find(b => b.id === bookmarkModal.id)
              : {}
          }
          handleSubmit={bookmarkModal.id ? editBookmark : createBookmark}
          visible={bookmarkModal.isOpen}
          closeModal={() => setBookmarkModal({ isOpen: false, id: undefined })}
          folderId={folderId}
        />
      </Wrapper>
    );
  }
);

export default Bookmarks;
