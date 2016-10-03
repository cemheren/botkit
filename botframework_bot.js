var Botkit = require('./lib/Botkit.js');
var os = require('os');
var controller = Botkit.botframeworkbot({
    appId: "4125d813-2afe-4aa0-ba81-d0bd8bcb2a46",
    appPassword: "RL7gdo4iJiP5PnJrxySPssQ",
    debug: false,
});

controller.setupWebserver(process.env.port || 3978, 
    function(err, server) {});

var bot = controller.spawn();

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

    var user = message.user;

    if (user && user.name) {
        bot.send(message, 'Hello ' + user.name + '!!');
    } else {
        bot.send(message, 'Hello.');
    }
});