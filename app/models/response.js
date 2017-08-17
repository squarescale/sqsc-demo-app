// Example model


module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    container: DataTypes.STRING,
    result: DataTypes.TEXT
  });

  return Response;
};
