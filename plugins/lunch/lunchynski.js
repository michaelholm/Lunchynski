// lunchynski.js
//
var FoodPurveyor = require('./models/FoodPurveyor.js');

var purveyor = new FoodPurveyor(); // instantiated to use for find, quicker, more efficient??

var lunchbot;

var plugin = {
  initialize: function(options) {
    var self = this;
    var controller = options.controller || {};

    controller.hears(['lunch', 'lunch?'],'direct_message,direct_mention', function(bot,message) {
      lunchynski.setBot(bot);

      var CB_dinein = dinein_callback();
      var CB_default = default_callback();
      var CB_carryout = carryout_callback();
      var CB_random = random_callback();
      var CB_foodtruck = foodtruck_callback();

      // start a conversation to handle this response.
      bot.startConversation(message, function(err,convo) {

        convo.ask('Did I hear lunch - want me to recommend a place?',[
          {
            pattern: 'done',
            callback: function(response,convo) {
              convo.say('OK you are done!');
              convo.next();
            }
          },
          {
            pattern: bot.utterances.yes,
            callback: function(response,convo) {
              convo.sayFirst('Great! Here goes...');
              convo.next();
            }
          },
          {
            pattern: bot.utterances.no,
            callback: function(response,convo) {
              convo.say('Perhaps later.');
              convo.stop();
              convo.next();
            }
          },
          {
            default: true,
            callback: function(response,convo) {
              // repeat the question
              convo.repeat();
              convo.next();
            }
          }
        ]); // end ask

        convo.ask("What kind of place? You can respond with 'food truck', 'dine in', 'carry out', 'random' or 'food court'", [
          {
            pattern: 'done',
            callback: function(response,convo) {
              convo.say('Sweet. Go eat!');
              convo.next();
            }
          },
          {
            pattern: bot.utterances.yes,
            callback: function(response,convo) {
              convo.say('Chocolate chip cookies.');
              convo.next();
            }
          },
          {
            pattern: bot.utterances.no,
            callback: function(response,convo) {
              convo.say('Ok, does this stir your apetite?');
              convo.next();
            }
          },
          {
            pattern: 'random',
            callback: function(response, convo) {
              purveyor.find({
                order: 'RANDOM()',
                limit: 1
              },
              function(err, restaurants) {
                if (err) {
                  console.log('ERR:', err);
                } else {
                  var question = 'How about ' + restaurants[0].name + '?';
                  convo.ask(question, CB_random);
                }
                convo.next();
              });
            }
          },
          {
            pattern: '^food truck$',
            callback: function(response,convo) {
              purveyor.find({
                order: 'RANDOM()',
                limit: 1,
                where: {
                  'location_type': { like : '%truck%' }
                }
              },
              function(err, rows) {
                var question = 'How about ' + rows[0].name + '?';
                convo.ask(question, CB_foodtruck);
                convo.next();
              });
            }
          },
          {
            pattern:'carry out',
            callback: function(response,convo) {
              purveyor.find({
                order: 'RANDOM()',
                limit: 1,
                where: {
                  'location_type': { like : '%carry%' }
                }
              },
              function(err, rows) {
                var question = 'How about ' + rows[0].name + '?';
                convo.ask(question, CB_carryout);
                convo.next();
              });
            }
          },
          {
            pattern:'dine in',
            callback: function(response,convo) {
              purveyor.find({
                order: 'RANDOM()',
                limit: 1,
                where: {
                  'location_type': { like : '%carry%' }
                }
              },
              function(err, rows) {
                var question = 'How about ' + rows[0].name + '?';
                convo.ask(question, CB_dinein);
                convo.next();
              });

            }
          },
          {
            default: true,
            callback: function(response,convo) {
              // repeat the question
              convo.repeat();
              convo.next();
            }
          }
        ]); // end ask

      }); // end startConversation
    }); // end hears

    controller.hears(['add eats', 'new restaurant'],'direct_message,direct_mention', function(bot,message) {

      var restaurant = {
        name: '',
        location: '',
        location_type: '',
        cuisine: ''
      };

      function restToString(restaurant) {
        var obj = restaurant;
        var ret = obj.name + ' is a ' + obj.location_type + '. It is located at ' + obj.location + ' and serves ' + obj.cuisine;
        return ret;
      }

      bot.startConversation(message,function(err,convo) {

        convo.say("Let's do this.");
        convo.ask('What is the name of the restaurant?', function(response, convo) {
          restaurant.name = response.text;
          convo.next();
        }, { key: 'restaurant' });
        convo.ask('What is the address or location of the restaurant? You can say \'Roving\' for a food truck.', function(response, convo) {
          restaurant.location = response.text;
          convo.next();
        }, { key: 'restaurant' });
        convo.ask('What sort of restaurant? You can reply with Food Truck, Dine In, Carry Out, or Food Court.', function(response, convo) {
          restaurant.location_type = response.text;
          convo.next();
        }, { key: 'restaurant' });

        convo.ask('So, tell me. What sort of cuisine?', function(response, convo) {
          restaurant.cuisine = response.text;
          convo.next();
        }, { key: 'restaurant' });
        convo.say('If you want to change anything, say the name of the field you want to edit. Say Name, Location, Type, or Cuisine.'); // this is a 'say', need to have a check for say or ask
        convo.ask("That's it. Say Done if all is good, or Show if you want to see the deets.", [
          {
            pattern: 'done',
            callback: function(response,convo) {
              lunchynski.addPurveyor(restaurant);
              convo.say('OK you are done!');
              convo.say(restToString(restaurant));
              convo.next();
            }
          },
          {
            pattern: bot.utterances.yes,
            callback: function(response,convo) {
              FoodPurveyor.create({
                name: restaurant.name,
                location: restaurant.location,
                location_type: restaurant.location_type,
                cuisine: restaurant.cuisine
              }).then(function() {
                FoodPurveyor
                .findOrCreate({where: {name: restaurant.name} })
                .spread(function(purveyor, created) {
                  console.log(purveyor.get({
                    plain: true
                  }))
                  console.log(created);
                })
              });
              //addToDb(restaurant); // add the new row
              convo.say('OK you are done!');
              convo.say('Added: ' + restToString(restaurant));
              convo.next();
            }
          },
          {
            pattern: 'show',
            callback: function(response,convo) {
              convo.say(restaurant.name + ' is a ' + restaurant.location_type + '. It is located at ' + restaurant.location + ' and serves ' + restaurant.cuisine);
            }
          },
          {
            pattern: 'name',
            callback: function(response,convo) {
              convo.ask('What is the name of the restaurant?', function(response, convo) {
                restaurant.name = response.text;
                convo.next();
              });
            }
          },
          {
            pattern: 'location',
            callback: function(response,convo) {
              convo.ask('What is the address or location of the restaurant? You can say \'Roving\' for a food truck.', function(response, convo) {
                restaurant.location = response.text;
                convo.next();
              });
            }
          },
          {
            pattern: 'type',
            callback: function(response,convo) {
              convo.ask('What sort of restaurant? You can reply with Food Truck, Dine In, Carry Out, or Food Court.', function(response, convo) {
                restaurant.location_type = response.text;
                convo.next();
              });
            }
          },
          {
            pattern: 'cuisine',
            callback: function(response,convo) {
              convo.ask('So, tell me. What sort of cuisine?', function(response, convo) {
                restaurant.cuisine = response.text;
                convo.next();
              });
            }
          },
          {
            default: true,
            callback: function(response,convo) {
              // repeat the question
              convo.repeat();
              convo.next();
            }
          }
        ], { key: 'restaurant' });

      });
    });

  },

  setBot: function(bot) {
    lunchbot = bot;
  },

  default_callback: function() {
    return [
        {
          pattern: 'done',
          callback: function(response,convo) {
            convo.say('Sweet. Go eat!');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.yes,
          callback: function(response,convo) {
            convo.sayFirst('May the food be with you, my friend.');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.no,
          callback: function(response,convo) {
            purveyor.findAll({
              // order: 'RANDOM()',
              limit: 1,
              where: {
                location_type: { $like : '%truck%' }
              }
            },
            function(err, rows) {
              var question = 'How about ' + rows[0].name + '?';
              convo.ask(question, exports.default_callback());
              convo.next();
            });
            convo.next();
          }
        },
        {
          default: true,
          callback: function(response,convo) {
            // repeat the question
            convo.repeat();
            convo.next();
          }
        }
    ];
  },

  foodtruck_callback: function() {
    return [
        {
          pattern: 'done',
          callback: function(response,convo) {
            convo.say('Sweet. Go eat!');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.yes,
          callback: function(response,convo) {
            convo.sayFirst('May the food be with you, my friend.');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.no,
          callback: function(response,convo) {
            purveyor.findAll({
              //order: 'RANDOM()',
              limit: 1,
              where: {
                location_type: { $like : '%truck%' }
              }
            },
            function(err, rows) {
              var question = 'How about ' + rows[0].name + '?';
              convo.ask(question, exports.foodtruck_callback());
              convo.next();
            });
            convo.next();
          }
        },
        {
          default: true,
          callback: function(response,convo) {
            // repeat the question
            convo.repeat();
            convo.next();
          }
        }
    ];
  },

  random_callback: function() {
    return [
      {
        pattern: 'done',
        callback: function(response,convo) {
          convo.say('Sweet. Go eat!');
          convo.next();
        }
      },
      {
        pattern: lunchbot.utterances.yes,
        callback: function(response,convo) {
          convo.sayFirst('Food is good.');
          convo.next();
        }
      },
      {
        pattern: lunchbot.utterances.no,
        callback: function(response,convo) {
          purveyor.findAll({
            //order: 'RANDOM()',
            limit: 1
          },
          function(err, restaurants) {
            if (err) {
              console.log('ERR:', err);
            } else {
              var question = 'How about ' + restaurants[0].name + '?';
              convo.ask(question, exports.random_callback());
            }
            convo.next();
          });
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ];
  },

  carryout_callback: function () {
    return [
      {
        pattern: 'done',
        callback: function(response,convo) {
          convo.say('Sweet. Go eat!');
          convo.next();
        }
      },
      {
        pattern: lunchbot.utterances.yes,
        callback: function(response,convo) {
          convo.sayFirst('How much do you love food! Go eat.');
          convo.next();
        }
      },
      {
        pattern: lunchbot.utterances.no,
        callback: function carry_cb(response,convo) {
          purveyor.findAll({
              //order: 'RANDOM()',
              limit: 1,
              where: {
                location_type: { $like : '%carry%' }
              }
            },
          function(err, rows) {
            if (err) {
              console.log("ERROR ", err);
              convo.next();
            }

            var question = 'How about ' + rows[0].name + '?';
            convo.ask(question, exports.carryout_callback());
            convo.next();
          });
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          console.log('default');
          // repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ];
  },

  dinein_callback: function() {
    return [
        {
          pattern: 'done',
          callback: function(response,convo) {
            convo.say('Sweet. Go eat!');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.yes,
          callback: function(response,convo) {
            convo.sayFirst('How much do you love food! Go eat.');
            convo.next();
          }
        },
        {
          pattern: lunchbot.utterances.no,
          callback: function(response,convo) {
            purveyor.findAll({
              limit: 1,
              //order: 'RANDOM()',
              where: { location_type: { $like: '%dine%' } }
            },
            function(err, restaurants) {
              if (err) {
                console.log('ERR:', err);
              } else {
                var question = 'How about ' + restaurants[0].name + '?';
                convo.ask(question, exports.dinein_callback());
              }
              convo.next();
            });
          }
        },
        {
          default: true,
          callback: function(response,convo) {
            // repeat the question
            convo.repeat();
            convo.next();
          }
        }
    ];
  },

  addPurveyor: function(restaurant) {
    FoodPurveyor.create({
      name: restaurant.name,
      location: restaurant.location,
      location_type: restaurant.location_type,
      cuisine: restaurant.cuisine
    });
  }

};

module.exports = plugin;
