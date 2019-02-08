import axios from "axios";
import * as R from "ramda";
import qs from "qs";

const BASE_URL =
  process.env.NODE_ENV === "development" ? "" : process.env.REACT_APP_API_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.request.use(function(config) {
  const token = sessionStorage.getItem("jwtToken");
  if (token) {
    config.headers.common["x-access-token"] = token;
  }
  return config;
});

axios.interceptors.response.use(R.propOr({}, "data"), function(error) {
  return Promise.reject(R.pathOr({}, ["response", "data"], error));
});

export const users = {
  login: user => axios.post("/users/login", user),
  signup: user => axios.post("/users/signup", user)
};

export const bookmarks = {
  fetch: (page, folderId) =>
    axios.get(
      `/bookmarks?${qs.stringify({
        page: page || 1,
        folderId
      })}`
    ),
  create: bookmark => axios.post("/bookmarks", bookmark),
  update: (bookmark, bookmarkId) =>
    axios.put(`/bookmarks/${bookmarkId}`, bookmark),
  delete: bookmarkId => axios.delete(`/bookmarks/${bookmarkId}`)
};

export const folders = {
  fetch: () => axios.get("/folders"),
  create: folder => axios.post("/folders", folder),
  delete: folderId => axios.delete(`/folders/${folderId}`)
};
