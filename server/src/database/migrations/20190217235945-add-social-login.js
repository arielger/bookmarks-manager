module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn("Users", "googleId", Sequelize.STRING, {
        notEmpty: true,
        unique: true
      }),
      // Added column type to prevent error "Cannot read property 'key' of undefined"
      // https://github.com/sequelize/sequelize/issues/4123#issuecomment-213116527
      queryInterface.changeColumn("Users", "password", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn("Users", "googleId"),
      queryInterface.changeColumn("Users", "password", {
        type: Sequelize.STRING,
        allowNull: false
      })
    ])
};
