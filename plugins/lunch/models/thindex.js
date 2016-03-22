var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = {
  database: global.root.process.env.PWD + '/data/lunchynski.db',
  dialect: 'sqlite',
  username: 'root',
  password: null
};
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;





// var Sequelize = require('sequelize');
//   var dbPath = global.root.process.env.PWD + '/data/lunchynski.db';
//   var sequelize = new Sequelize(dbPath, 'root', null, {
//     dialect: 'sqlite'
//   });