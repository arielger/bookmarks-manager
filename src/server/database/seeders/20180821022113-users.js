const R = require("ramda");
const randomInt = require("random-int");
const sampleSize = require("lodash.samplesize");

// Factories
const generateRandomUser = require("../../components/users").factory;
const generateRandomTag = require("../../components/tags").factory;
const generateRandomBookmark = require("../../components/bookmarks").factory;

/* eslint-disable no-console */

const generateBookmarkTag = (bookmarkId, tagId) => ({
  bookmarkId,
  tagId,
  createdAt: new Date(),
  updatedAt: new Date()
});

module.exports = {
  up: async queryInterface => {
    const users = R.times(generateRandomUser, 5);
    const dbUsers = await queryInterface.bulkInsert("users", users, {
      returning: true
    });

    // Add tags for each user
    const tags = R.pipe(
      R.map(user => R.times(() => generateRandomTag(user.id), 5)),
      R.flatten
    )(dbUsers);

    const dbTags = await queryInterface.bulkInsert("tags", tags, {
      returning: true
    });

    // Add bookmarks for each user
    const bookmarks = R.pipe(
      R.map(user => R.times(() => generateRandomBookmark(user.id), 5)),
      R.flatten
    )(dbUsers);

    const dbBookmarks = await queryInterface.bulkInsert(
      "bookmarks",
      bookmarks,
      { returning: true }
    );

    const bookmarkTags = R.chain(user => {
      const bookmarksFromUser = dbBookmarks.filter(b => b.userId === user.id);
      const tagsFromUser = dbTags.filter(t => t.userId === user.id);

      // For each bookmark add from 0 to 5 tags
      return R.chain(bookmark => {
        const randomTagsSample = sampleSize(tagsFromUser, randomInt(5));
        return randomTagsSample.map(tag =>
          generateBookmarkTag(bookmark.id, tag.id)
        );
      }, bookmarksFromUser);
    }, dbUsers);

    await queryInterface.bulkInsert("BookmarkTag", bookmarkTags);
  },

  down: async queryInterface => {
    console.log("🗑 Delete bookmarks");
    await queryInterface.bulkDelete("bookmarks", null, {});

    console.log("🗑 Delete tags");
    await queryInterface.bulkDelete("tags", null, {});

    console.log("🗑 Delete users");
    await queryInterface.bulkDelete("users", null, {});

    console.log("🗑 Delete bookmark tags");
    await queryInterface.bulkDelete("BookmarkTag", null, {});
  }
};
