const Sequelize = require('sequelize')

const db = new Sequelize ('florist', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
} );

module.exports = db;