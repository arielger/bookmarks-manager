import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { notification } from "antd";
import { folders as foldersApi } from "../api";

const loadFolders = (page, folderId) => ({
  type: "loadFolders",
  promise: foldersApi.fetch(page, folderId)
});

const createFolder = folderData => ({
  type: "createFolder",
  promise: foldersApi.create(folderData)
});

const foldersSlice = createSlice({
  slice: "folders",
  initialState: {
    isLoading: false,
    isNewFolderLoading: false,
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
    }
  }
});

export { loadFolders, createFolder };
export default foldersSlice.reducer;
