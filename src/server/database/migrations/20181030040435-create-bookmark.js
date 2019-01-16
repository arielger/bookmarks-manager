module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable("Bookmarks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        validate: { isUrl: true }
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
        notEmpty: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        notEmpty: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: queryInterface => queryInterface.dropTable("Bookmarks")
};
