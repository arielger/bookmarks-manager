module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define("Folder", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    icon: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    title: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
  Folder.associate = models => {
    Folder.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Folder;
};
