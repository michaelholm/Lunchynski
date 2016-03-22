
var LunchbotUtterances = function() {}

LunchbotUtterances.prototype.utterances = {
	foodtruck: new RegExp(/^(foodtruck|food truck|food trucks|foodtrucks)/i),
    carryout: new RegExp(/^(carryout|carry out|take out|takeout)/i),
    dinein: new RegExp(/^(dinein|dine in|eat in|eatin)/i)
}

module.exports =  LunchbotUtterances;