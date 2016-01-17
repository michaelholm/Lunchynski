/**
*  FoodPurveyor schema
*
*  @version     0.0.1
*
**/

/**
*  Define  FoodPurveyor Model
*  @param  {Object}  schema
*  @return {Object}  model
*
**/

module.exports = function(sequelize, DataTypes) {

  //var sqlite3 = require('sqlite3').verbose();
  //var nodeSql = require('nodesql');
  // var Sequelize = require('sequelize');
  // var dbPath = global.root.process.env.PWD + '/data/lunchynski.db';
  // var sequelize = new Sequelize(dbPath, 'root', null, {
  //   dialect: 'sqlite'
  // });

  var FoodPurveyor = sequelize.define('restaurants',
    {
      restaurant_id: { type: DataTypes.INTEGER },
      name: {
         type: DataTypes.STRING,
         allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cuisine: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: { type: DataTypes.DATE },
      updated: { type: DataTypes.STRING }
    },
    {
      instanceMethods: {
        getDescription: function()  {
          return this.name + 'is located at ' + this.location + '. It offers ' + this.location_type + ' dining, and serves ' + this.cuisine;
        }
      }
  });

  /**
   *  location_type:  { 
   *    type: Sequelize.ENUM,
   *    values: ['Food Truck', 'Dine In', 'Carry Out', 'Food Court']
   *  },
   *  
   * 
   */

  return FoodPurveyor;
};
