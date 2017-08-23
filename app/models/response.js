module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    container: {
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    scaleX: DataTypes.INTEGER,
    scaleY: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    startX: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    startY: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    stepX: DataTypes.INTEGER,
    stepY: DataTypes.INTEGER,
    iter: DataTypes.INTEGER,
    result: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true
      }
    }
  });

  return Response;
};
