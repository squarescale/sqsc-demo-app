module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    container: {
      type: DataTypes.STRING,
      allowNull: false
    },
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    scaleX: DataTypes.INTEGER,
    scaleY: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    startX: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startY: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stepX: DataTypes.INTEGER,
    stepY: DataTypes.INTEGER,
    iter: DataTypes.INTEGER,
    result: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    clientToken: DataTypes.BIGINT
  });

  return Response;
};
