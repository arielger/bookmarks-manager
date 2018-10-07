import axios from "axios";

// @todo: Add CRUD endpoints creator

export const users = {
  login: user => axios.post("/users/login", user),
  signup: user => axios.post("/users/signup", user)
};

export const bookmarks = {
  getAll: () => axios.get("/bookmarks"),
  create: bookmark => axios.post("/bookmarks", bookmark)
};
