import React from "react";
import * as R from "ramda";
import { connect } from "react-redux";
import { List, Avatar, Button } from "antd";
import styled from "styled-components/macro";
import humanizeUrl from "humanize-url";
import qs from "qs";
import InfiniteScroll from "react-infinite-scroller";
import BookmarkForm from "./BookmarkForm";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  loadBookmarksPage,
  createBookmark,
  editBookmark,
  deleteBookmark,
  resetBookmarksList
} from "../../store/bookmarks";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
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
    isEditBookmarkLoading: bookmarks.isEditBookmarkLoading,
    morePagesAvailable: bookmarks.morePagesAvailable
  }),
  {
    loadBookmarksPage,
    createBookmark,
    editBookmark,
    deleteBookmark,
    resetBookmarksList
  }
)(
  ({
    bookmarks = [],
    isLoading,
    isNewBookmarkLoading,
    isEditBookmarkLoading,
    morePagesAvailable,
    loadBookmarksPage,
    createBookmark,
    editBookmark,
    deleteBookmark,
    resetBookmarksList,
    match,
    history,
    location
  }) => {
    const folderId = R.pipe(
      R.path(["params", "folderId"]),
      folderId => parseInt(folderId, 10),
      R.defaultTo(undefined)
    )(match);

    const search = R.prop(
      "search",
      qs.parse(location.search, { ignoreQueryPrefix: true })
    );

    const [bookmarkModal, setBookmarkModal] = React.useState({
      isOpen: false,
      id: undefined
    });

    React.useEffect(() => {
      resetBookmarksList();
    }, [folderId, search]);

    return (
      <Wrapper>
        <Sidebar
          folderId={folderId}
          showAddBookmark={() => {
            setBookmarkModal({ isOpen: true });
          }}
        />
        <Content>
          <Header history={history} location={location} folderId={folderId} />
          <ListWrapper>
            <InfiniteScroll
              key={`${folderId}-${search}`}
              initialLoad={true}
              loadMore={page => loadBookmarksPage(page, folderId, search)}
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
        </Content>
        <BookmarkForm
          isNew={!bookmarkModal.id}
          isLoading={isNewBookmarkLoading || isEditBookmarkLoading}
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
