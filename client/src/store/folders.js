import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { notification } from "antd";
import { folders as foldersApi } from "../api";
import history from "../history";

const loadFolders = (page, folderId) => ({
  type: "loadFolders",
  promise: foldersApi.fetch(page, folderId)
});

const createFolder = folderData => ({
  type: "createFolder",
  promise: foldersApi.create(folderData)
});

const editFolder = (folderData, folderId) => ({
  type: "editFolder",
  promise: foldersApi.update(folderData, folderId),
  meta: {
    folderId
  }
});

const deleteFolder = folderId => ({
  type: "deleteFolder",
  promise: foldersApi.delete(folderId),
  meta: {
    folderId,
    onSuccess: () => {
      history.push("/");
    }
  }
});

const foldersSlice = createSlice({
  slice: "folders",
  initialState: {
    isLoading: false,
    isNewFolderLoading: false,
    isEditFolderLoading: false,
    isDeleteFolderLoading: false,
    data: []
  },
  extraReducers: {
    loadFolders(state, action) {
      return handle(state, action, {
        start: R.assoc("isLoading", true),
        failure: R.assoc("error", true),
        success: R.assoc("data", action.payload),
        finish: R.assoc("isLoading", false)
      });
    },
    createFolder(state, action) {
      return handle(state, action, {
        start: R.assoc("isNewFolderLoading", true),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to create a new folder"
          });

          return R.assoc("error", true)(prevState);
        },
        success: R.evolve({
          data: R.append(action.payload)
        }),
        finish: R.assoc("isNewFolderLoading", false)
      });
    },
    editFolder(state, action) {
      return handle(state, action, {
        start: R.assoc("isEditFolderLoading", true),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to edit the folder"
          });
          return prevState;
        },
        success: R.evolve({
          data: R.map(
            R.when(
              R.propEq("id", action.meta.folderId),
              R.mergeLeft(action.payload)
            )
          )
        }),
        finish: R.assoc("isEditFolderLoading", false)
      });
    },
    deleteFolder(state, action) {
      return handle(state, action, {
        start: R.assoc("isDeleteFolderLoading", true),
        failure: prevState => {
          notification.error({
            message: "Error",
            description: "There was an error trying to delete the folder"
          });
          return prevState;
        },
        success: R.evolve({
          data: R.reject(R.propEq("id", action.meta.folderId))
        }),
        finish: R.assoc("isDeleteFolderLoading", false)
      });
    },
    createBookmark(state, action) {
      return handle(state, action, {
        success: prevState => {
          if (!action.payload.folderId) return prevState;
          return R.evolve({
            data: R.map(
              R.when(
                R.propEq("id", action.payload.folderId),
                R.evolve({ bookmarksCount: R.inc })
              )
            )
          })(prevState);
        }
      });
    }
  }
});

export { loadFolders, createFolder, editFolder, deleteFolder };
export default foldersSlice.reducer;
