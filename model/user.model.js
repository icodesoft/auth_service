const { DataTypes, Model } = require('sequelize');
const { sequelize } =  require('../config/sequelize.config')

class User extends Model {}
  
  User.init({
      id : {
        type: DataTypes.INTEGER,
        field: 'id',
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        field: 'username',
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        field: 'full_name',
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sex: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      companyName: {
        type: DataTypes.STRING,
        field: 'company_name',
        allowNull: true
      },
      createDate: {
        type: DataTypes.DATE,
        field: 'create_date',
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      loginDate: {
        type: DataTypes.DATE,
        field: 'login_date',
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    },
    {
      sequelize: sequelize,
      // 数据库表名称
      tableName: 'user'
    }
  )
  
  module.exports = {User, sequelize}