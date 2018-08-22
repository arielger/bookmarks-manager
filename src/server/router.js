const bookmarkController = require("./components/bookmarks/controller");
const tagController = require("./components/tags/controller");
const userController = require('./components/users/controller');
const verifyToken = require('./middleware/verifyToken');

module.exports.set = app => {
  // Bookmarks
  app.get("/bookmarks", verifyToken, bookmarkController.getBookmarks);
  app.get("/bookmarks/:id", verifyToken, bookmarkController.getBookmark);
  app.post("/bookmarks", verifyToken, bookmarkController.addBookmark);

  // Tags
  app.get("/tags", verifyToken, tagController.getTags);
  app.get("/tags/:id", verifyToken, tagController.getTag);
  app.post("/tags", verifyToken, tagController.addTag);

  // Auth
  app.post('/users/login', userController.logIn);
  app.get('/users/me', verifyToken, userController.me);
  app.post('/users/logout', userController.logOut);
  app.post('/users/signup', userController.signUp);
};
