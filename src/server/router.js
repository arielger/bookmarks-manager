const bookmarkController = require("./controllers/bookmark");
const tagController = require("./controllers/tag");

module.exports.set = app => {
  // Bookmarks
  app.get("/bookmarks", bookmarkController.getBookmarks);
  app.get("/bookmarks/:id", bookmarkController.getBookmark);
  app.post("/bookmarks", bookmarkController.addBookmark);

  // Tags
  app.get("/tags", tagController.getTags);
  app.get("/tags/:id", tagController.getTag);
  app.post("/tags", tagController.addTag);
};
