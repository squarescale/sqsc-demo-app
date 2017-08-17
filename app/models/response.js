// Example model


module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    container: DataTypes.STRING,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    scaleX: DataTypes.INTEGER,
    scaleY: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    step: DataTypes.INTEGER,
    stepX: DataTypes.INTEGER,
    stepY: DataTypes.INTEGER,
    iter: DataTypes.INTEGER,
    result: DataTypes.TEXT
  });

  return Response;
};
