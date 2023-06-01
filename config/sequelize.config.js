const { Sequelize } = require('sequelize');

// Automatically pass transactions to all queries
const cls = require('cls-hooked');
const { db } = require('./app.config')
const namespace = cls.createNamespace('auth-namespace');
Sequelize.useCLS(namespace);

console.log("db info: ", db.database, db.username, db.password)
const sequelize = new Sequelize(db.database, db.username, db.password, {
  logging: console.log,
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  pool: {
    max: db.pool.max,
    min: db.pool.min,
    idle: db.pool.idle
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false // disable creation of createdAt, updatedAt for tables
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { Sequelize, sequelize }