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

var request = require('request');

// var Constants = [
//   API_ROOT_URL: 'http://0.0.0.0:3000/api',
//   API_URLS: [
//   	'cuisines': {
//   		'getAll': '/Cuisines',js
//   		'create': '/Cuisines',
//   		'getOne': '/Cuisines/{id}'
//   	},
//   	'foodVendor': {
//   		'getAll': '/FoodVendors',
//   		'create': '/FoodVendors',
//   		'getOne': '/FoodVendors/{id}'
//   	}
//   ]
// ];


var FoodPurveyor = function(options) {
  this.options = options;
}

FoodPurveyor.prototype.data = {}

FoodPurveyor.prototype.getAll = function() {
  return new Promise(function(resolve, reject) {
    request.get({
      uri: "http://0.0.0.0:3000/api/FoodVendors",
      method: 'GET'
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

FoodPurveyor.prototype.getByLocationType = function(type) {
  type = type ? type : 'Carry Out';
  var requestUrl = "http://0.0.0.0:3000/api/FoodVendors/bylocationtype?type="+encodeURIComponent(type);
  console.log('food trucking: getByLocationType', requestUrl);
  return new Promise(function(resolve, reject) {
    request.get({
      uri: requestUrl,
      method: 'GET'
    }, function(error, response, body) {
      if (error) {
        console.log('error', error);
        reject(error);
      } else {
        console.log('success', JSON.parse(body));
        resolve(JSON.parse(body));
      }
    });
  });
};

FoodPurveyor.prototype.getRandom = function() {
  return new Promise(function(resolve, reject) {
    request.get({
      uri: "http://0.0.0.0:3000/api/FoodVendors",
      method: 'GET'
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

// FoodPurveyor.getRandom = function() {
//   return new Promise(function(resolve, reject) {
//     request.get({
//       uri: "http://0.0.0.0:3000/api/FoodVendors",
//       method: 'GET'
//     }, function(error, response, body) {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(JSON.parse(body));
//       }
//     });
//   });
// }

// FoodPurveyor.remoteMethod(
//   'getRandom', {
//     accepts: {},
//     returns: {arg: 'restaurant', type: 'string'}
//   }
// );

FoodPurveyor.prototype.getOne = function(id) {
  request({
    uri: "http://0.0.0.0:3000/api/FoodVendors/"+ id,
    method: "POST",
    form: {
      name: "Place to eat",
      location: "somewhere",
      location_type: "food truck",
      cuisine: "food"
    }
  }, function(error, response, body) {
    console.log(body);
  });
};

module.exports = FoodPurveyor;

