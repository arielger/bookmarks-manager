import { configureStore, getDefaultMiddleware } from "redux-starter-kit";
import { middleware as reduxPackMiddleware } from "redux-pack";
import bookmarks from "./bookmarks";
import folders from "./folders";
import user from "./user";

const store = configureStore({
  reducer: {
    bookmarks,
    folders,
    user
  },
  middleware: [reduxPackMiddleware, ...getDefaultMiddleware()]
});

export default store;
