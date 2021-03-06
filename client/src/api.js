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
  if (R.path(["response", "status"], error) === 403) {
    sessionStorage.removeItem("jwtToken");
    window.location.reload(true);
  }
  return Promise.reject(R.pathOr(error, ["response", "data"], error));
});

export const users = {
  login: user => axios.post("/users/login", user),
  signup: user => axios.post("/users/signup", user),
  logInWithProvider: (provider, accessToken, isSignUp) =>
    axios.post(
      `/auth/${provider}?${qs.stringify({
        isSignUp
      })}`,
      {
        access_token: accessToken
      }
    ),
  forgotPassword: email => axios.post("/users/forgot-password", { email }),
  resetPassword: (newPassword, token) =>
    axios.post("/users/reset-password", { newPassword, token })
};

export const bookmarks = {
  fetch: (page, folderId, search) =>
    axios.get(
      `/bookmarks?${qs.stringify({
        page: page || 1,
        folderId,
        search
      })}`
    ),
  create: bookmark => axios.post("/bookmarks", bookmark),
  update: (bookmarkData, bookmarkId) =>
    axios.put(`/bookmarks/${bookmarkId}`, bookmarkData),
  delete: bookmarkId => axios.delete(`/bookmarks/${bookmarkId}`)
};

export const folders = {
  fetch: () => axios.get("/folders"),
  create: folder => axios.post("/folders", folder),
  update: (folderData, folderId) =>
    axios.put(`/folders/${folderId}`, folderData),
  delete: folderId => axios.delete(`/folders/${folderId}`)
};
