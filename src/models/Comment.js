module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: DataTypes.STRING,
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, { timestamps: false });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    Comment.belongsTo(models.Request, {
      foreignKey: 'requestId'
    });
  };
  return Comment;
};
