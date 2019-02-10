const BOOKMARK_FOLDER_CONSTRAINT = "BOOKMARK_FOLDER_CONSTRAINT";

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface
        .createTable("Folders", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          title: {
            type: Sequelize.STRING,
            notEmpty: true
          },
          icon: {
            type: Sequelize.STRING,
            notEmpty: true
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Users",
              key: "id"
            }
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        })
        .then(() =>
          queryInterface.addColumn("Bookmarks", "folderId", Sequelize.INTEGER)
        )
        .then(() =>
          queryInterface.addConstraint("Bookmarks", ["folderId"], {
            type: "FOREIGN KEY",
            name: BOOKMARK_FOLDER_CONSTRAINT,
            references: {
              table: "Folders",
              field: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
          })
        )
    ]),
  down: queryInterface =>
    queryInterface
      .removeConstraint("Bookmarks", BOOKMARK_FOLDER_CONSTRAINT)
      .then(() => queryInterface.removeColumn("Bookmarks", "folderId"))
      .then(() => queryInterface.dropTable("Folders"))
};
