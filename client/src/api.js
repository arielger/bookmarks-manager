import axios from "axios";

const BASE_URL =
  "production" === "development" ? "" : process.env.REACT_APP_API_URL;

console.log("BASE_URL", BASE_URL);

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

// @todo: Add CRUD endpoints creator

axios.interceptors.request.use(function(config) {
  const token = sessionStorage.getItem("jwtToken");
  if (token) {
    config.headers.common["x-access-token"] = token;
  }
  return config;
});

export const users = {
  login: user => axios.post("/users/login", user),
  signup: user => axios.post("/users/signup", user)
};

export const bookmarks = {
  getAll: () => axios.get("/bookmarks"),
  create: bookmark => axios.post("/bookmarks", bookmark),
  update: (bookmark, bookmarkId) =>
    axios.put(`/bookmarks/${bookmarkId}`, bookmark),
  delete: bookmarkId => axios.delete(`/bookmarks/${bookmarkId}`)
};
