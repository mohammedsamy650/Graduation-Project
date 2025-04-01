// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Prediction = require('./prediction')(sequelize, Sequelize.DataTypes);

User.hasMany(Prediction);
Prediction.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Prediction,
};