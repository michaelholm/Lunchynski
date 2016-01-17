controller.hears(['lunch'],'direct_message,direct_mention',function(bot,message) {
	// start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

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
          convo.say('Great! I will continue...');
          // do something else...
          convo.next();
        }
      },
      {
        pattern: bot.utterances.no,
        callback: function(response,convo) {
          convo.say('Perhaps later.');
          // do something else...
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ]);

  });

  var places = ['bobs', 'joes drive in', 'bubba burger', 'tinas tacos', 'burts burger inn', 'palace of pizza'];
  convo.ask('How about ' +  + '. You get it. Oh, and you can always say DONE to quit. I would never be mad!', function(bot,message) {

  });


});

controller.hears(['add a lunch place'],'direct_message,direct_mention', [
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
          convo.say("Ok Let's do this...");
          // do something else...
          convo.next();
        }
      },
      {
        pattern: bot.utterances.no,
        callback: function(response,convo) {
          convo.say('Perhaps later.');
          // do something else...
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.repeat();
          convo.next();
        }
      }
    ]);