module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define("Bookmark", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: { isUrl: true }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
      notEmpty: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      notEmpty: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
  Bookmark.associate = models => {
    Bookmark.belongsTo(models.User, { foreignKey: "userId" });
    Bookmark.belongsTo(models.Folder, { foreignKey: "folderId" });
  };
  return Bookmark;
};
