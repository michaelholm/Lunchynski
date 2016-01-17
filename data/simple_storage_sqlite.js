/**
***
***  sqlite3 Storage module for bots.
***
**/
var sqlite3 = require('sqlite3').verbose();
var nodeSql = require('nodesql');
var caminte = require('caminte');
var dbconfig = {
  driver: "sqlite3",
  database: 'data/lunchynski.db'
}
var schema = new Schema(dbconfig.driver, dbconfig);
var FoodPurveyor = require('./../plugins/lunch/models/FoodPurveyor.js');

module.exports = function(config) {
	
	var objectsToList = function(cb) {
    return function(err, data) {
      if (err) {
        cb(err, data)
      } else {
        cb(err, Object.keys(data).map(function (key) {
            return data[key];
        }));
      }
      
    };
  };

	var storage = {
    FoodPurveyor: {
      get: function(team_id, cb) {
        FoodPurveyor.find({
          order: 'RANDOM()',
          limit: 1
        },  
        function(err, restaurants) {
         	cb(data)
        });
      },
      save: function(purveyor, cb) {
        purveyor.save();
      },
      all: function(cb) {
        FoodPurveyor.all(objectsToList(cb));
      }
    }
  };

  return storage;

}
