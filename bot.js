/*~~~~~~~ Built with Botkit. ~~~~~~~*/

require('request');
var $ = require('jquery');
var Botkit = require('./node_modules/botkit/lib/Botkit.js');

/** load plugins **/
var Lunchynski = require('./plugins/lunch/lunchynski.js');

process.env.token = "xoxb-16927784195-7itklbjCFQwQhBqvB6lxr33J";

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot,message) {
  bot.reply(message,"Hello.");
});

controller.hears(['dm me'],'direct_message,direct_mention',function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say('Private reply!');
  });
});

/** launch plugins **/
var options = {
  debug: true,
  log: true,
  logLevel: 7
};
options.controller = controller;
Lunchynski.start(options);
