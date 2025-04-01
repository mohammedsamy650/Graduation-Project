// models/prediction.js
module.exports = (sequelize, DataTypes) => {
    const Prediction = sequelize.define('Prediction', {
      rotationalSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      toolWear: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      torque: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      machineType: {
        type: DataTypes.ENUM('0-L', '1-M', '2-H'),
        allowNull: false,
      },
      predictionProbability: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      noFailure: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      recommendation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    return Prediction;
  };