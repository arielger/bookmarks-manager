import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { notification } from "antd";
import { bookmarks as bookmarksApi } from "../api";

const loadBookmarksPage = (page, folderId, search) => ({
  type: "loadBookmarksPage",
  promise: bookmarksApi.fetch(page, folderId, search)
});

const createBookmark = bookmarkData => ({
  type: "createBookmark",
  promise: bookmarksApi.create(bookmarkData)
});

const editBookmark = (bookmarkData, bookmarkId) => ({
  type: "editBookmark",
  promise: bookmarksApi.update(bookmarkData, bookmarkId),
  meta: {
    bookmarkId
  }
});

const deleteBookmark = bookmarkId => ({
  type: "deleteBookmark",
  promise: bookmarksApi.delete(bookmarkId),
  meta: {
    bookmarkId
  }
});

const bookmarksSlice = createSlice({
  slice: "bookmarks",
  initialState: {
    isLoading: false,
    isNewBookmarkLoading: false,
    isEditBookmarkLoading: false,
    morePagesAvailable: true,
    data: []
  },
  reducers: {
    resetBookmarksList(state) {
      return R.mergeLeft({
        morePagesAvailable: true,
        data: []
      })(state);
    }
  },
  extraReducers: {
    loadBookmarksPage(state, action) {
      return handle(state, action, {
        start: R.assoc("isLoading", true),
        failure: R.assoc("error", true),
        success: prevState =>
          R.pipe(
            R.evolve({ data: R.concat(action.payload.results) }),
            R.assoc(
              "morePagesAvailable",
              R.pathOr(false, ["info", "morePagesAvailable"], action.payload)
            )
          )(prevState),
        finish: R.assoc("isLoading", false)
      });
    },
    createBookmark(state, action) {
      return handle(state, action, {
        start: R.assoc("isNewBookmarkLoading", true),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to create a new bookmark"
          });

          return prevState;
        },
        success: R.evolve({
          data: R.append(action.payload)
        }),
        finish: R.assoc("isNewBookmarkLoading", false)
      });
    },
    editBookmark(state, action) {
      return handle(state, action, {
        start: R.assoc("isEditBookmarkLoading", true),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to edit the bookmark"
          });

          return prevState;
        },
        success: R.evolve({
          data: R.map(
            R.when(
              R.propEq("id", action.meta.bookmarkId),
              R.mergeLeft(action.payload)
            )
          )
        }),
        finish: R.assoc("isEditBookmarkLoading", false)
      });
    },
    deleteBookmark(state, action) {
      return handle(state, action, {
        start: R.evolve({
          data: R.map(
            R.when(
              R.propEq("id", action.meta.bookmarkId),
              R.assoc("hide", true)
            )
          )
        }),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to delete the bookmark"
          });

          return R.evolve({
            data: R.map(
              R.when(R.propEq("id", action.meta.bookmarkId)),
              R.dissoc("hide")
            )
          })(prevState);
        },
        success: R.evolve({
          data: R.reject(R.propEq("id", action.meta.bookmarkId))
        })
      });
    }
  }
});

const { actions, reducer } = bookmarksSlice;
const { resetBookmarksList } = actions;
export {
  loadBookmarksPage,
  createBookmark,
  editBookmark,
  deleteBookmark,
  resetBookmarksList
};
export default reducer;
