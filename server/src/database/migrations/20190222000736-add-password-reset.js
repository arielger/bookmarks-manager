module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn("Users", "resetPasswordToken", Sequelize.UUID, {
        notEmpty: true
      }),
      queryInterface.addColumn(
        "Users",
        "resetPasswordExpires",
        Sequelize.DATE,
        {
          notEmpty: true
        }
      )
    ]),

  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn("Users", "resetPasswordToken"),
      queryInterface.removeColumn("Users", "resetPasswordExpires")
    ])
};
