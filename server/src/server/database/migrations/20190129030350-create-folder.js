module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.createTable("Folders", {
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
      }),
      queryInterface.addColumn("Bookmarks", "folderId", Sequelize.INTEGER, {
        references: {
          model: "Users",
          key: "id"
        }
      })
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface.dropTable("Folders"),
      queryInterface.removeColumn("Bookmarks", "folderId")
    ])
};
