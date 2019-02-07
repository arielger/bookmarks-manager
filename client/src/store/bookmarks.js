import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { notification } from "antd";
import { bookmarks as bookmarksApi } from "../api";

const loadBookmarksPage = (page, folderId) => ({
  type: "loadBookmarksPage",
  promise: bookmarksApi.fetch(page, folderId)
});

const createBookmark = bookmarkData => ({
  type: "createBookmark",
  promise: bookmarksApi.create(bookmarkData)
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
    morePagesAvailable: true,
    data: []
  },
  reducers: {
    changeFolder(state) {
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
const { changeFolder } = actions;
export { loadBookmarksPage, createBookmark, deleteBookmark, changeFolder };
export default reducer;
